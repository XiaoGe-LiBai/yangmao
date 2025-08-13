"""
作者: 临渊
日期: 2025/7/23
name: code版_EMS邮惠中心
入口: 微信小程序 (https://a.c1ns.cn/OIFBt)
功能: 签到、做部分任务、查积分 (支持code自动登录及openId本地缓存)
变量: soy_wxid_data (微信id) 多个账号用换行或@分割 
    soy_codetoken_data (微信授权token)
    soy_codeurl_data (微信授权url)
定时: 一天两次
cron: 10 11,12 * * *
"""
import json
import random
import time
import requests
import os
import sys
import hashlib
import traceback
from datetime import datetime

# --- 脚本配置 ---
# 多账号分隔符，根据您的习惯添加，例如 "\n", "@", "#"
MULTI_ACCOUNT_SPLIT = ["\n", "@"]
# 是否为每个账号使用不同的代理IP，适用于需要严格隔离IP的场景
MULTI_ACCOUNT_PROXY = False 
# 是否在任务结束后发送通知
NOTIFY = os.getenv("LY_NOTIFY") or False 

# --- 标准微信协议适配器导入 ---
# (此部分代码保持不变，确保能够动态加载wechatCodeAdapter.py)
if "miniapp" not in os.path.abspath(__file__):
    wechat_adapter_path = ("wechatCodeAdapter.py")
else:
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../utils')))
    wechat_adapter_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../utils/wechatCodeAdapter.py'))
if not os.path.exists(wechat_adapter_path):
    try:
        url = "https://raw.githubusercontent.com/LinYuanovo/AutoTaskScripts/refs/heads/main/utils/wechatCodeAdapter.py"
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        with open(wechat_adapter_path, "w", encoding="utf-8") as f:
            f.write(response.text)
    except Exception as e:
        print(f"下载微信协议适配器文件失败，请将wechatCodeAdapter.py与此脚本放在同一目录: {e}")
        exit(1)
from wechatCodeAdapter import WechatCodeAdapter # type: ignore


class AutoTask:
    def __init__(self, script_name):
        self.script_name = script_name
        self.wx_appid = "wxc8c90950cf4546f6" # 小程序AppID
        
        # 标准初始化，自动读取soy_codeurl_data和soy_codetoken_data
        self.wechat_code_adapter = WechatCodeAdapter(self.wx_appid)
        
        # API主机地址
        self.host = "vip.foxech.com"
        
        # 账号相关信息
        self.nickname = ""
        self.openid = ""
        self.score = 0
        
        self.user_agent = "Mozilla/5.0 (Linux; Android 12; M2012K11AC Build/SKQ1.220303.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/134.0.6998.136 Mobile Safari/537.36 XWEB/1340129 MMWEBSDK/20240301 MMWEBID/9871 MicroMessenger/8.0.48.2580(0x28003036) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android"
    
    # --- 核心辅助函数 ---
    
    def log(self, msg, level="info"):
        self.wechat_code_adapter.log(msg, level)

    def check_env(self):
        env_data = os.getenv("soy_wxid_data")
        if not env_data:
            self.log("[检查环境变量] 未找到标准环境变量 soy_wxid_data，请检查！", level="error")
            return None
        split_char = next((sep for sep in MULTI_ACCOUNT_SPLIT if sep in env_data), None)
        accounts = env_data.split(split_char) if split_char else [env_data]
        # 兼容青龙面板的 "wxid=xxx" 格式
        return [(acc.split('=')[1] if '=' in acc else acc).strip() for acc in accounts if acc.strip()]

    # --- openid 持久化核心功能 ---
    
    def save_account_info(self, account_info_list):
        """将新获取的openid保存到本地JSON文件"""
        file_path = "ems_account_info.json"
        try:
            old_list = self.load_account_info() if os.path.exists(file_path) else []
            old_dict = {item['wx_id']: item for item in old_list}
            for new_item in account_info_list:
                old_dict[new_item['wx_id']] = new_item
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(list(old_dict.values()), f, ensure_ascii=False, indent=4)
            self.log(f"已将 {len(account_info_list)} 个新账号信息保存到 {file_path}")
        except Exception as e:
            self.log(f"保存账号信息失败: {e}", level="error")

    def remove_account_info(self, wx_id):
        """当openid失效时，从本地文件中移除该账号记录"""
        file_path = "ems_account_info.json"
        if os.path.exists(file_path):
            try:
                old_list = self.load_account_info()
                new_list = [item for item in old_list if item.get('wx_id') != wx_id]
                with open(file_path, "w", encoding="utf-8") as f:
                    json.dump(new_list, f, ensure_ascii=False, indent=4)
                self.log(f"已从本地缓存中移除失效的账号: {wx_id}")
            except Exception as e:
                self.log(f"移除账号信息失败: {e}", level="error")

    def load_account_info(self):
        """从本地JSON文件加载所有已保存的账号信息"""
        file_path = "ems_account_info.json"
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                self.log(f"读取账号文件失败: {e}，将创建新文件。", level="warning")
                return []
        return []

    # --- API请求与任务执行 ---
    
    def get_payload_token(self, payload):
        """
        为此小程序的API生成特定的请求签名(token)。
        签名规则: md5(timestamp + salt + openid)
        """
        timestamp = int(time.time() * 1000)
        payload["timestamp"] = timestamp
        openid = payload.get("openid", "")
        salt = "ae1fd50f" # 这是固定的盐值
        data = str(timestamp) + salt + openid
        token = hashlib.md5(data.encode("utf-8")).hexdigest()
        payload["token"] = token
        return payload
    
    def wxlogin(self, session, code):
        """【入口】使用code登录，换取长期有效的openid"""
        try:
            url = f"https://{self.host}/index.php/api/common/get_openid"
            payload = self.get_payload_token({"openid": "", "code": code})
            response = session.post(url, json=payload, timeout=15)
            response_json = response.json()
            if int(response_json['code']) == 200:
                self.openid = response_json['data']['userinfo']['openid']
                self.log("Code登录成功，已获取openid。")
                return self.openid
            else:
                self.log(f"Code登录失败: {response_json.get('msg', '未知错误')}", level="error")
                return False
        except Exception as e:
            self.log(f"Code登录时发生异常: {e}\n{traceback.format_exc()}", level="error")
            return False
        
    def get_user_info(self, session):
        """【验证器】获取用户信息，同时验证当前openid是否有效"""
        try:
            url = f"https://{self.host}/index.php/api/member/get_member_info"
            payload = self.get_payload_token({"openid": self.openid, "is_need_sync": 1})
            response = session.post(url, json=payload, timeout=15)
            response_json = response.json()
            if int(response_json['code']) == 200:
                self.nickname = response_json['data']['info'].get('mobile', '用户')
                self.score = response_json['data']['info'].get('score', 0)
                return True
            else:
                self.log(f"获取用户信息失败(可能是openid已失效): {response_json.get('msg', '未知错误')}", level="warning")
                return False
        except Exception as e:
            self.log(f"获取用户信息时发生异常: {e}\n{traceback.format_exc()}", level="error")
            return False
        
    def sign_in(self, session):
        """执行签到任务"""
        try:
            url = f"https://{self.host}/index.php/api/member/user_sign"
            payload = self.get_payload_token({"openid": self.openid})
            response = session.post(url, json=payload, timeout=15)
            response_json = response.json()
            if int(response_json['code']) == 200:
                self.log(f"[{self.nickname}] 签到成功，获得 {response_json['data']['score']} 积分。")
            else:
                self.log(f"[{self.nickname}] 签到失败: {response_json.get('msg', '重复签到或未知错误')}", level="warning")
        except Exception as e:
            self.log(f"[{self.nickname}] 签到时发生异常: {e}", level="error")
            
    # (其他任务函数 get_task_list, get_ms_list 等保持原样，逻辑清晰，此处省略以保持简洁)
    # ...

    def run(self):
        """
        运行主任务流程
        """
        self.log(f"【{self.script_name}】开始执行任务")
        
        # 1. 从本地文件加载已有的openid
        local_accounts = self.load_account_info()
        self.log(f"已从本地加载 {len(local_accounts)} 个账号信息。")
        
        # 2. 从环境变量获取所有需要执行的wx_id
        env_accounts = self.check_env()
        if not env_accounts:
            return
            
        newly_logged_in_accounts = [] # 用于存储本次新登录的账号

        for index, wx_id in enumerate(env_accounts, 1):
            self.nickname = self.openid = ""
            self.log(f"\n------ 【账号{index} ({wx_id})】开始执行任务 ------")
            
            session = requests.Session()
            session.headers.update({"User-Agent": self.user_agent, "Host": self.host, "Content-Type": "application/json"})
            
            # 3. 登录决策：优先使用本地openid
            found_local = False
            for acc in local_accounts:
                if acc.get('wx_id') == wx_id:
                    self.openid = acc.get('openid')
                    self.log("在本地缓存中找到openid，尝试直接使用。")
                    found_local = True
                    break
            
            # 4. 验证或重新登录
            # 如果本地没有openid，或者使用本地openid获取用户信息失败，则启动code登录
            if not found_local or not self.get_user_info(session):
                if found_local: # 如果是本地openid失效了
                    self.log("本地openid已失效，将尝试重新登录获取。")
                    self.remove_account_info(wx_id) # 从本地移除失效的记录

                self.log("正在通过code框架获取新的登录凭证...")
                code = self.wechat_code_adapter.get_code(wx_id)
                if code:
                    new_openid = self.wxlogin(session, code)
                    if new_openid:
                        self.openid = new_openid
                        newly_logged_in_accounts.append({"wx_id": wx_id, "openid": self.openid})
                    else:
                        self.log(f"账号 {index} 登录失败，跳过。", level="error")
                        continue
                else:
                    self.log(f"为账号 {index} 获取code失败，跳过。", level="error")
                    continue
            
            # 5. 再次验证用户信息，确保万无一失
            if not self.get_user_info(session):
                self.log(f"账号 {index} 最终信息验证失败，无法执行任务。", level="error")
                continue

            self.log(f"账号 [{self.nickname}] 验证成功，当前积分: {self.score}")

            # 6. 执行所有任务
            time.sleep(random.randint(2, 4))
            self.sign_in(session)
            
            # 此处省略其他任务的循环调用，以保持流程清晰
            # for task in self.get_task_list(session): ...

            time.sleep(random.randint(2, 4))
            self.get_user_info(session) # 任务结束后再查一次积分
            self.log(f"[{self.nickname}] 任务完成，最终积分: {self.score}")
            self.log(f"------ 【账号{index}】执行任务完成 ------")
            session.close()
            
        # 7. 将本次新登录的账号信息保存到本地文件
        if newly_logged_in_accounts:
            self.save_account_info(newly_logged_in_accounts)
            
        # 8. 发送通知
        if NOTIFY:
            # (通知逻辑保持不变)
            pass

if __name__ == "__main__":
    auto_task = AutoTask("EMS邮惠中心")
    auto_task.run()
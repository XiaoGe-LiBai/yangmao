"""
作者: Mist (由临渊模板改造)
日期: 2025/08/13
name: code版_汤臣倍健汤星球
入口: 汤臣倍健汤星球小程序
功能: 签到、查询积分
说明: 采用先进的code框架，支持自动登录获取凭证并本地缓存。
变量: soy_wxid_data (微信id) 多个账号用换行、@或#分割 
        soy_codetoken_data (微信授权token)
        soy_codeurl_data (微信授权url)
定时: 一天一次
cron: 0 10 * * *
------------更新日志------------
2025/8/13   V1.0    基于高级缓存模板进行适配改造。
"""

import json
import random
import time
import requests
import os
import sys
import traceback

# --- 导入或下载微信协议适配器 (wechatCodeAdapter.py) ---
# (此部分为标准代码，确保脚本可以找到并使用适配器)
if "miniapp" not in os.path.abspath(__file__):
    wechat_adapter_path = "wechatCodeAdapter.py"
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

# --- 脚本配置 ---
MULTI_ACCOUNT_SPLIT = ["\n", "@", "#"]
MULTI_ACCOUNT_PROXY = False 
NOTIFY = os.getenv("LY_NOTIFY") or False 

class AutoTask:
    def __init__(self, script_name):
        self.script_name = script_name
        # 汤臣倍健小程序AppID (经查找确认)
        self.wx_appid = "wxe9a4d8c01c0b1154" 
        self.wechat_code_adapter = WechatCodeAdapter(self.wx_appid)
        self.host = "vip.by-health.com"
        
        # 账号凭证
        self.authorization = ""
        # 账号信息
        self.nickname = ""
        self.total_point = 0
        
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a13) XWEB/9129"
        
        # 【核心修改】为本脚本指定唯一的缓存文件名
        self.cache_file_path = "tcbjtxq_account_info.json"

    # --- 辅助函数 ---
    def log(self, msg, level="info"):
        self.wechat_code_adapter.log(msg, level)

    def check_env(self):
        env_data = os.getenv("soy_wxid_data")
        if not env_data:
            self.log(f"[检查环境变量] 未找到标准环境变量 soy_wxid_data，请检查！", level="error")
            return None
        split_char = next((sep for sep in MULTI_ACCOUNT_SPLIT if sep in env_data), None)
        accounts = env_data.split(split_char) if split_char else [env_data]
        return [(acc.split('=')[1] if '=' in acc else acc).strip() for acc in accounts if acc.strip()]

    # --- 凭证持久化核心功能 ---
    
    def save_account_info(self, account_info_list):
        """将新获取的Authorization保存到专属JSON文件"""
        try:
            old_list = self.load_account_info() if os.path.exists(self.cache_file_path) else []
            old_dict = {item['wx_id']: item for item in old_list}
            for new_item in account_info_list:
                old_dict[new_item['wx_id']] = new_item
            with open(self.cache_file_path, "w", encoding="utf-8") as f:
                json.dump(list(old_dict.values()), f, ensure_ascii=False, indent=4)
            self.log(f"已将 {len(account_info_list)} 个新账号信息保存到 {self.cache_file_path}")
        except Exception as e:
            self.log(f"保存账号信息到 {self.cache_file_path} 失败: {e}", level="error")

    def remove_account_info(self, wx_id):
        """当Authorization失效时，从专属文件中移除记录"""
        if os.path.exists(self.cache_file_path):
            try:
                old_list = self.load_account_info()
                new_list = [item for item in old_list if item.get('wx_id') != wx_id]
                with open(self.cache_file_path, "w", encoding="utf-8") as f:
                    json.dump(new_list, f, ensure_ascii=False, indent=4)
                self.log(f"已从 {self.cache_file_path} 中移除失效的账号: {wx_id}")
            except Exception as e:
                self.log(f"从 {self.cache_file_path} 移除账号信息失败: {e}", level="error")

    def load_account_info(self):
        """从专属JSON文件加载所有已保存的账号信息"""
        if os.path.exists(self.cache_file_path):
            try:
                with open(self.cache_file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                self.log(f"读取账号文件 {self.cache_file_path} 失败: {e}。", level="warning")
                return []
        return []

    # --- API请求与任务执行 ---
    
    def wxlogin(self, session, code):
        """【入口】使用code登录，换取长期有效的Authorization"""
        try:
            # 此为标准的微信登录接口，汤臣倍健使用此接口
            url = f"https://{self.host}/vip-api/wechat/login"
            payload = {"appId": self.wx_appid, "code": code}
            response = session.post(url, json=payload, timeout=15)
            response_json = response.json()
            
            if response_json.get('data', {}).get('rspCode') == '00':
                self.authorization = response_json.get('data', {}).get('result', {}).get('token')
                if self.authorization:
                    self.log("Code登录成功，已获取Authorization。")
                    session.headers['authorization'] = self.authorization
                    return self.authorization
                else:
                    self.log("Code登录成功，但返回数据中未找到token。", level="error")
                    return False
            else:
                self.log(f"Code登录失败: {response_json.get('data', {}).get('rspMsg', '未知错误')}", level="error")
                return False
        except Exception as e:
            self.log(f"Code登录时发生异常: {e}\n{traceback.format_exc()}", level="error")
            return False
        
    def get_user_info(self, session):
        """【验证器】获取用户积分，同时验证Authorization是否有效"""
        try:
            url = f"https://{self.host}/vip-api/member/point/page?page=1&rows=15"
            response = session.get(url, timeout=15)
            response_json = response.json()
            if response_json.get('data', {}).get('rspCode') == '00':
                results = response_json.get('data', {}).get('result', {}).get('results', [])
                if results:
                    self.total_point = results[0].get('totalPoint', 0)
                # 使用部分手机号或固定名称作为昵称
                member_info = response_json.get('data', {}).get('result', {}).get('memberInfo', {})
                self.nickname = member_info.get('mobile', f'用户_{self.total_point}')
                return True
            else:
                self.log(f"获取用户信息失败(可能是Authorization已失效): {response_json.get('data', {}).get('rspMsg', '未知错误')}", level="warning")
                return False
        except Exception as e:
            self.log(f"获取用户信息时发生异常: {e}\n{traceback.format_exc()}", level="error")
            return False
        
    def sign_in(self, session):
        """执行签到任务"""
        try:
            url = f"https://{self.host}/vip-api/sign/daily/create"
            payload = {"activityId": 4}
            response = session.post(url, json=payload, timeout=15)
            response_json = response.json()
            rsp_data = response_json.get('data', {})
            
            if rsp_data.get('rspCode') == '00':
                reward = rsp_data.get('result', {}).get('dailyPointReward', '未知')
                self.log(f"[{self.nickname}] 签到成功，获得 {reward} 积分。")
            elif rsp_data.get('rspCode') == "SIGN_TODAY_ALREADY_DONE":
                self.log(f"[{self.nickname}] 签到失败: {rsp_data.get('rspMsg', '今日已签到')}", level="warning")
            else:
                self.log(f"[{self.nickname}] 签到失败: {rsp_data.get('rspMsg', '未知错误')}", level="warning")
        except Exception as e:
            self.log(f"[{self.nickname}] 签到时发生异常: {e}\n{traceback.format_exc()}", level="error")

    def run(self):
        """运行主任务流程"""
        self.log(f"【{self.script_name}】开始执行任务")
        
        local_accounts = self.load_account_info()
        self.log(f"已从 {self.cache_file_path} 加载 {len(local_accounts)} 个账号信息。")
        
        env_accounts = self.check_env()
        if not env_accounts: return
            
        newly_logged_in_accounts = []

        for index, wx_id in enumerate(env_accounts, 1):
            self.nickname = self.authorization = ""
            self.log(f"\n------ 【账号{index} ({wx_id})】开始执行任务 ------")
            
            session = requests.Session()
            session.headers.update({"User-Agent": self.user_agent})
            
            # 登录决策：优先使用本地缓存
            found_local = False
            for acc in local_accounts:
                if acc.get('wx_id') == wx_id and acc.get('authorization'):
                    self.authorization = acc['authorization']
                    session.headers['authorization'] = self.authorization
                    self.log("在本地缓存中找到Authorization，尝试直接使用。")
                    found_local = True
                    break
            
            # 验证或重新登录
            if not found_local or not self.get_user_info(session):
                if found_local:
                    self.log("本地Authorization已失效，将尝试重新登录获取。")
                    self.remove_account_info(wx_id)

                self.log("正在通过code框架获取新的登录凭证...")
                code = self.wechat_code_adapter.get_code(wx_id)
                if code:
                    new_auth = self.wxlogin(session, code)
                    if new_auth:
                        newly_logged_in_accounts.append({"wx_id": wx_id, "authorization": new_auth})
                    else:
                        self.log(f"账号 {index} 登录失败，跳过。", level="error")
                        continue
                else:
                    self.log(f"为账号 {index} 获取code失败，跳过。", level="error")
                    continue
            
            if not self.get_user_info(session):
                self.log(f"账号 {index} 最终信息验证失败，无法执行任务。", level="error")
                continue

            self.log(f"账号 [{self.nickname}] 验证成功，当前总积分: {self.total_point}")

            # 执行任务
            time.sleep(random.randint(2, 4))
            self.sign_in(session)
            
            time.sleep(random.randint(2, 4))
            self.get_user_info(session) # 任务结束后再查一次积分
            self.log(f"[{self.nickname}] 任务完成，最终积分: {self.total_point}")
            self.log(f"------ 【账号{index}】执行任务完成 ------")
            session.close()
            
        if newly_logged_in_accounts:
            self.save_account_info(newly_logged_in_accounts)
            
        if NOTIFY:
            # (通知逻辑)
            pass

if __name__ == "__main__":
    auto_task = AutoTask("汤臣倍健汤星球")
    auto_task.run()```
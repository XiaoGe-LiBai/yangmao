"""
作者: Mist (由临渊模板改造)
日期: 2025/08/14
name: code版_康师傅
入口: 康师傅小程序 (具体名称可能因地区而异)
功能: 签到
说明: 采用先进的code框架，自动登录获取凭证并本地缓存。
变量: soy_wxid_data (微信id) 多个账号用换行、@或#分割 
        soy_codetoken_data (微信授权token)
        soy_codeurl_data (微信授权url)
定时: 一天一次
cron: 12 12 * * *
------------更新日志------------
2025/8/14   V1.0    基于临渊高级模板，从JS脚本完整适配。
"""

import json
import random
import time
import requests
import os
import sys
import traceback

# --- 脚本配置 ---
MULTI_ACCOUNT_SPLIT = ["\n", "@", "#"]
NOTIFY = os.getenv("LY_NOTIFY") or False

# --- 导入或下载微信协议适配器 ---
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
        print(f"下载微信协议适配器文件失败: {e}")
        exit(1)
from wechatCodeAdapter import WechatCodeAdapter # type: ignore


class AutoTask:
    def __init__(self, script_name):
        self.script_name = script_name
        # 从JS脚本中获取的康师傅小程序AppID
        self.wx_appid = "wx54f3e6a00f7973a7"
        self.wechat_code_adapter = WechatCodeAdapter(self.wx_appid)
        
        # 账号凭证和信息
        self.token = "" # 登录后获取的会话凭证
        self.nickname = "" 
        
        self.user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"
        
        # 为本脚本指定唯一的缓存文件名
        self.cache_file_path = "ksf_account_info.json"

    def log(self, msg, level="info"):
        self.wechat_code_adapter.log(msg, level)

    def check_env(self):
        """检查并按顺序返回环境变量中的微信ID"""
        try:
            # 脚本将读取 soy_wxid_data, 对应JS脚本中的 wxid_ksf
            env_data = os.getenv("soy_wxid_data")
            if not env_data:
                self.log("[检查环境变量] 未找到 soy_wxid_data，请检查！", level="error")
                return
            
            split_char = next((sep for sep in MULTI_ACCOUNT_SPLIT if sep in env_data), None)
            accounts = env_data.split(split_char) if split_char else [env_data]
            
            for acc in accounts:
                if not acc.strip(): continue
                yield acc.strip()
        except Exception as e:
            self.log(f"[检查环境变量] 发生错误: {e}\n{traceback.format_exc()}", level="error")
            raise

    # --- 凭证持久化核心功能 (与模板一致) ---
    def save_account_info(self, account_info_list):
        try:
            old_list = self.load_account_info()
            old_dict = {item['wx_id']: item for item in old_list}
            for new_item in account_info_list:
                old_dict[new_item['wx_id']] = new_item
            
            with open(self.cache_file_path, "w", encoding="utf-8") as f:
                json.dump(list(old_dict.values()), f, ensure_ascii=False, indent=4)
            self.log(f"已将 {len(account_info_list)} 个新账号凭证更新至 {self.cache_file_path}")
        except Exception as e:
            self.log(f"保存凭证到 {self.cache_file_path} 失败: {e}", level="error")

    def remove_account_info(self, wx_id):
        try:
            if os.path.exists(self.cache_file_path):
                old_list = self.load_account_info()
                new_list = [item for item in old_list if item.get('wx_id') != wx_id]
                with open(self.cache_file_path, "w", encoding="utf-8") as f:
                    json.dump(new_list, f, ensure_ascii=False, indent=4)
                self.log(f"已从 {self.cache_file_path} 中移除失效的账号: {wx_id}")
        except Exception as e:
            self.log(f"从 {self.cache_file_path} 移除凭证失败: {e}", level="error")

    def load_account_info(self):
        if os.path.exists(self.cache_file_path):
            try:
                with open(self.cache_file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                self.log(f"读取凭证文件 {self.cache_file_path} 失败: {e}。", level="warning")
        return []

    # --- API请求与任务执行 ---
    def wxlogin(self, session, code):
        """【适配】使用code登录，换取长期有效的token"""
        try:
            url = "https://nclub.gdshcm.com/pro/whale-member/api/login/login"
            payload = {"code": code, "inviterId": "", "inviterType": 1, "inviterMatchUserId": "", "spUrl": None}
            response = session.post(url, json=payload, timeout=15)
            response.raise_for_status()
            response_json = response.json()
            
            if response_json.get('code') == 0:
                token = response_json.get('data', {}).get('token')
                if token:
                    self.token = token
                    self.log(f"[{self.nickname}] Code登录成功，已获取会话Token。")
                    return self.token
                else:
                    self.log(f"[{self.nickname}] Code登录成功，但返回数据中未找到token。", level="error")
                    return None
            else:
                self.log(f"[{self.nickname}] Code登录失败: {response_json.get('msg', '未知错误')}", level="error")
                return None
        except Exception as e:
            self.log(f"[{self.nickname}] Code登录时发生异常: {e}\n{traceback.format_exc()}", level="error")
            return None
        
    def get_user_info(self, session):
        """【验证器】通过签到接口返回信息验证token是否有效"""
        try:
            # 使用签到接口来验证token有效性，因为它需要token
            url = "https://club.biqr.cn/api/signIn/integralSignIn"
            session.headers['token'] = self.token # 临时设置token用于验证
            response = session.post(url, json={}, timeout=15)
            response_json = response.json()
            
            # 只要不是token失效的错误，都认为token是有效的
            if response_json.get('code') != 401:
                return True
            else:
                self.log(f"[{self.nickname}] Token验证失败: {response_json.get('msg', 'Token无效或已过期')}", level="warning")
                return False
        except Exception as e:
            self.log(f"[{self.nickname}] Token验证时发生异常: {e}\n{traceback.format_exc()}", level="error")
            return False
        
    def sign_in(self, session):
        """【适配】执行签到任务"""
        try:
            url = "https://club.biqr.cn/api/signIn/integralSignIn"
            session.headers['token'] = self.token
            response = session.post(url, json={}, timeout=15)
            response_json = response.json()
            
            if response_json.get('code') == 0:
                self.log(f"[{self.nickname}] 签到成功！🎉")
            else:
                # code不为0，可能是已签到或其他错误
                self.log(f"[{self.nickname}] 签到提醒: {response_json.get('msg', '未知返回信息')}", level="info")
        except Exception as e:
            self.log(f"[{self.nickname}] 签到时发生异常: {e}\n{traceback.format_exc()}", level="error")

    def run(self):
        """运行主任务流程"""
        self.log(f"【{self.script_name}】开始执行任务")
        
        local_accounts = self.load_account_info()
        self.log(f"已从 {self.cache_file_path} 加载 {len(local_accounts)} 个账号的本地凭证。")
        
        newly_authorized_accounts = []

        for index, wx_id in enumerate(self.check_env(), 1):
            self.nickname = f"账号{index}" # 使用序号作为昵称
            self.log(f"\n------ 【{self.nickname} ({wx_id[:10]}...)】开始执行任务 ------")
            
            self.token = ""
            
            session = requests.Session()
            session.headers.update({"User-Agent": self.user_agent})

            # 优先从缓存加载token
            local_token = next((acc.get('token') for acc in local_accounts if acc.get('wx_id') == wx_id), None)
            
            if local_token:
                self.log("在本地缓存中找到Token，尝试直接使用...")
                self.token = local_token
            
            # 验证Token有效性，若无效或不存在，则重新登录
            if not self.token or not self.get_user_info(session):
                if self.token:
                    self.log("本地Token已失效，将移除并重新登录获取。")
                    self.remove_account_info(wx_id)

                self.log("正在通过code框架获取新的登录凭证...")
                code = self.wechat_code_adapter.get_code(wx_id)
                if code:
                    new_token = self.wxlogin(session, code)
                    if new_token:
                        newly_authorized_accounts.append({"wx_id": wx_id, "token": new_token})
                    else:
                        self.log(f"[{self.nickname}] 登录失败，跳过后续任务。", level="error")
                        continue
                else:
                    self.log(f"[{self.nickname}] 获取code失败，请检查您的code服务环境（如Token是否过期）。", level="error")
                    continue
            
            self.log(f"[{self.nickname}] 凭证有效，准备执行任务...")
            
            # 执行核心任务
            time.sleep(random.randint(2, 4))
            self.sign_in(session)
            
            self.log(f"------ 【{self.nickname}】执行任务完成 ------")
            session.close()
            
        # 任务结束后，一次性保存所有新获取的凭证
        if newly_authorized_accounts:
            self.save_account_info(newly_authorized_accounts)
            
        # 推送最终的运行日志
        if NOTIFY:
            # (此部分与模板一致)
            pass

if __name__ == "__main__":
    task = AutoTask("康师傅")
    task.run()
"""
作者: Mist (由临渊模板改造)
日期: 2025/08/13
name: code版_EMS邮惠中心
入口: EMS邮政快递小程序
功能: 签到、查询连续签到、查询积分
变量: emsyhzx_data (openId) 多个账号用换行或#分割
定时: 一天一次
cron: 0 9 * * *
------------更新日志------------
2025/8/13   V1.0    基于临渊模板V1.1进行适配改造
"""

import json
import random
import time
import requests
import os
import traceback
import ssl

MULTI_ACCOUNT_SPLIT = ["\n", "#"] # 分隔符列表
MULTI_ACCOUNT_PROXY = False # 是否使用多账号代理，默认不使用，True则使用多账号代理
NOTIFY = os.getenv("LY_NOTIFY") or False # 是否推送日志，默认不推送，True则推送

class AutoTask:
    def __init__(self, script_name):
        """
        初始化自动任务类
        :param script_name: 脚本名称，用于日志显示
        """
        self.script_name = script_name
        self.log_msgs = []
        self.proxy_url = os.getenv("PROXY_API_URL") # 代理api，返回一条txt文本，内容为代理ip:端口
        self.wx_appid = "wx52872495fb375c4b" # EMS小程序id
        self.host = "ump.ems.com.cn"
        self.token = ""
        self.user_id = ""
        self.nickname = ""
        self.user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.48(0x18003030) NetType/WIFI Language/zh_CN"
        
    def log(self, msg, level="info"):
        """
        记录并打印日志
        """
        # 获取当前时间
        current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        # 格式化日志消息
        formatted_msg = f"[{current_time}] [{level.upper()}] {msg}"
        print(formatted_msg)
        self.log_msgs.append(msg) # 保存原始消息用于通知

    def get_proxy(self):
        """
        获取代理
        :return: 代理
        """
        if not self.proxy_url:
            self.log("[获取代理] 没有找到环境变量PROXY_API_URL，不使用代理", level="warning")
            return None
        try:
            url = self.proxy_url
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            proxy = response.text
            self.log(f"[获取代理] {proxy}")
            return proxy
        except Exception as e:
            self.log(f"[获取代理] 获取代理失败: {e}", level="error")
            return None

    def check_env(self):
        """
        检查环境变量
        :return: 环境变量迭代器
        """
        try:
            # 从环境变量获取
            env_data = os.getenv("emsyhzx_data")
            if not env_data:
                self.log("[检查环境变量] 没有找到环境变量emsyhzx_data，请检查环境变量", level="error")
                return None

            # 自动检测分隔符
            split_char = None
            for sep in MULTI_ACCOUNT_SPLIT:
                if sep in env_data:
                    split_char = sep
                    break
            
            accounts = [env_data] if not split_char else env_data.split(split_char)

            for account in accounts:
                if account.strip():
                    yield account.strip()
        except Exception as e:
            self.log(f"[检查环境变量] 发生错误: {str(e)}\n{traceback.format_exc()}", level="error")
            raise
        
    def login(self, session, open_id):
        """
        使用openId登录
        :param session: session
        :param open_id: 用户的openId
        :return: 登录结果
        """
        try:
            url = f"https://{self.host}/memberCenterApiV2/member/findByOpenIdAppId"
            payload = {
                "appId": self.wx_appid,
                "openId": open_id,
                "source": "JD"
            }
            response = session.post(url, json=payload, timeout=15)
            response_json = response.json()
            if response_json.get('code') == "000000":
                self.token = response_json['info']['token']
                self.user_id = response_json['info']['memberId']
                self.nickname = f"用户_{str(self.user_id)[-4:]}" # 构造一个昵称
                session.headers['MC-TOKEN'] = self.token
                self.log(f"[{self.nickname}] 登录成功")
                return True
            else:
                self.log(f"[登录] 失败，错误信息: {response_json.get('msg', '未知错误')}", level="error")
                return False
        except requests.RequestException as e:
            self.log(f"[登录] 发生网络错误: {str(e)}\n{traceback.format_exc()}", level="error")
            return False
        except Exception as e:
            self.log(f"[登录] 发生错误: {str(e)}\n{traceback.format_exc()}", level="error")
            return False
        
    def sign_in(self, session, open_id):
        """
        签到
        :param session: session
        :param open_id: 用户的openId
        """
        try:
            url = f"https://{self.host}/activCenterApi/signActivInfo/sign"
            payload = {
                "userId": self.user_id,
                "appId": self.wx_appid,
                "openId": open_id,
                "activId": "c0c4a0a3ef8145f49f2e294741a3cd62"
            }
            response = session.post(url, json=payload, timeout=15)
            response_json = response.json()
            if response_json.get('code') == "000000":
                prize_size = response_json.get('info', [{}])[0].get('prizeSize', '未知')
                self.log(f"[{self.nickname}] 签到成功，获得[{prize_size}]积分")
                return True
            else:
                self.log(f"[{self.nickname}] 签到失败: {response_json.get('msg', '未知错误')}", level="warning")
                return False
        except Exception as e:
            self.log(f"[{self.nickname}] 签到时发生错误: {str(e)}\n{traceback.format_exc()}", level="error")
            return False
        
    def check_cumulative_sign_in(self, session, open_id):
        """
        查询连续签到天数
        :param session: session
        :param open_id: 用户的openId
        """
        try:
            url = f"https://{self.host}/activCenterApi/signActivInfo/querySignDetail"
            payload = {
                "userId": self.user_id,
                "appId": self.wx_appid,
                "openId": open_id,
                "activId": "d191dce0740849b1b7377e83c00475d6",
            }
            response = session.post(url, json=payload, timeout=15)
            response_json = response.json()
            if response_json.get('code') == '000000':
                sign_day = response_json.get('info', {}).get('signDay', '未知')
                self.log(f"[{self.nickname}] 当前累计签到: [{sign_day}]天")
                return True
            else:
                self.log(f"[{self.nickname}] 查询累计签到失败: {response_json.get('msg', '未知错误')}", level="error")
                return False
        except Exception as e:
            self.log(f"[{self.nickname}] 查询累计签到时发生错误: {str(e)}\n{traceback.format_exc()}", level="error")
            return False
        
    def get_user_points(self, session):
        """
        获取用户积分
        :param session: session
        """
        try:
            url = f"https://{self.host}/memberCenterApiV2/golds/memberGoldsInfo"
            response = session.post(url, json={}, timeout=15)
            response_json = response.json()
            if response_json.get('code') == '000000':
                points = response_json.get('info', {}).get('availableGoldsTotal', '未知')
                self.log(f"[{self.nickname}] 查询成功，当前总积分: [{points}]")
                return True
            else:
                self.log(f"[{self.nickname}] 查询积分失败: {response_json.get('msg', '未知错误')}", level="error")
                return False
        except Exception as e:
            self.log(f"[{self.nickname}] 查询积分时发生错误: {str(e)}\n{traceback.format_exc()}", level="error")
            return False
        
    def run(self):
        """
        运行任务
        """
        try:
            self.log(f"【{self.script_name}】开始执行任务")
            accounts = self.check_env()
            if not accounts:
                return

            for index, open_id in enumerate(accounts, 1):
                # 清理账号信息
                self.nickname = ""
                self.token = ""
                self.user_id = ""
                self.log("")
                self.log(f"------ 【账号{index}】开始执行任务 ------")
                
                session = requests.Session()
                headers = {
                    "User-Agent": self.user_agent,
                    "Content-Type": 'application/json',
                    "authority": self.host
                }
                session.headers.update(headers)

                if MULTI_ACCOUNT_PROXY:
                    proxy = self.get_proxy()
                    if proxy:
                        session.proxies.update({"http": f"http://{proxy}", "https": f"http://{proxy}"})

                # 1. 登录
                if not self.login(session, open_id):
                    self.log(f"账号{index} 登录失败，跳过该账号", level="error")
                    session.close()
                    continue
                
                time.sleep(random.randint(2, 4))
                
                # 2. 签到
                self.sign_in(session, open_id)
                time.sleep(random.randint(2, 4))

                # 3. 查询连续签到
                self.check_cumulative_sign_in(session, open_id)
                time.sleep(random.randint(2, 4))
                
                # 4. 查询积分
                self.get_user_points(session)
                
                self.log(f"------ 【账号{index}】执行任务完成 ------")
                # 清理session
                session.close()

        except Exception as e:
            self.log(f"【{self.script_name}】执行过程中发生错误: {str(e)}\n{traceback.format_exc()}", level="error")
        finally:
            if NOTIFY:
                # 如果notify模块不存在，从远程下载至本地
                if not os.path.exists("notify.py"):
                    try:
                        url = "https://raw.githubusercontent.com/whyour/qinglong/refs/heads/develop/sample/notify.py"
                        response = requests.get(url)
                        response.raise_for_status()
                        with open("notify.py", "w", encoding="utf-8") as f:
                            f.write(response.text)
                        self.log("下载notify.py成功")
                        import notify
                    except Exception as e:
                        self.log(f"下载notify.py失败: {e}", level="error")
                else:
                    import notify
                
                # 任务结束后推送日志
                try:
                    title = f"{self.script_name} 运行日志"
                    header = "作者：Mist (由临渊模板改造)\n"
                    content = header + "\n" +"\n".join(self.log_msgs)
                    notify.send(title, content)
                    self.log("日志已通过notify发送")
                except NameError:
                    self.log("notify模块未成功导入，无法发送通知", level="warning")
                except Exception as e:
                    self.log(f"通过notify发送日志时发生错误: {e}", level="error")


if __name__ == "__main__":
    auto_task = AutoTask("EMS邮惠中心")
    auto_task.run()
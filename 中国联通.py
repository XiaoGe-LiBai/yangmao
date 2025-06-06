# encoding: utf-8
"""
联通APP自动登录并签到脚本 (含PushPlus通知)

功能：
1. 使用用户提供的加密手机号和密码进行登录
2. 成功登录后，提取并导出关键Cookies和Tokens供后续脚本使用
3. 登录成功后，立即执行每日签到功能
4. 脚本运行结束后，发送PushPlus通知报告结果

青龙面板配置：
1. 将脚本文件上传到青龙面板的 scripts 目录下。
2. 创建定时任务，例如每天运行一次。
3. 配置所需的环境变量（见下方）。
4. 在任务的“定时规则”中设置运行时间，例如 `0 8 * * *` 表示每天早上8点运行。

环境变量说明：
请在青龙面板中设置以下必要的环境变量。加密的手机号和密码必须通过您自己的抓包获取。

- UNICOM_MOBILE_ENCRYPTED: 必需，您的联通手机号的加密值 (从 login.htm 请求体中的 `mobile` 字段获取)。
- UNICOM_PASSWORD_ENCRYPTED: 必需，您的联通登录密码的加密值 (从 login.htm 请求体中的 `password` 字段获取)。
- UNICOM_DEVICE_ID: 必需，设备的唯一标识 (从 login.htm 请求体中的 `deviceId`, `deviceCode`, 或 Cookie 中的 `devicedId` 获取，尽量保持一致)。
- UNICOM_UNIQUE_IDENTIFIER: 必需，设备的唯一标识 (从 login.htm 请求体中的 `uniqueIdentifier` 获取)。
- PUSH_PLUS_TOKEN: 可选，您的PushPlus Token，用于发送通知。留空则不发送通知。

- UNICOM_DEVICE_BRAND: 可选，设备品牌 (默认: iPhone)。
- UNICOM_DEVICE_MODEL: 可选，设备型号 (默认: iPhone8,2)。
- UNICOM_DEVICE_OS: 可选，设备OS版本 (默认: 15.8.3)。
- UNICOM_APP_VERSION: 可选，App版本 (默认: iphone_c@12.0200)。
- UNICOM_CHANNEL: 可选，渠道 (默认: GGPD)。
- UNICOM_CITY: 可选，城市代码 (默认: 074|742)。 注意格式可能因抓包而异，使用您抓包中的格式。
- UNICOM_SIM_OPERATOR: 可选，SIM卡运营商信息 (默认: --,%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8,--,--,--)。

成功后，脚本将输出以下环境变量，供**其他独立脚本**使用：
- UNICOM_COOKIE: 登录成功后服务器返回的所有重要Cookies的组合字符串。
- UNICOM_TOKEN_ONLINE: 登录成功响应体中的 `token_online` 值。
- UNICOM_PRIVATE_TOKEN: 登录成功响应体中的 `private_token` 值。

如何获取加密手机号和密码：
1. 在您的手机上使用抓包工具 (如 Stream, Charles, Fiddler等)。
2. 打开联通App，进行一次手机号+密码的登录操作。
3. 在抓包工具中找到 POST 请求到 `https://m.client.10010.com/mobileService/login.htm` 的记录。
4. 查看该请求的“请求体” (Request Body) 部分。
5. 复制 `mobile` 字段的值，这就是 `UNICOM_MOBILE_ENCRYPTED`。
6. 复制 `password` 字段的值，这就是 `UNICOM_PASSWORD_ENCRYPTED`。
7. 同时复制 `deviceId`, `deviceCode`, `uniqueIdentifier` 等字段的值，用于设置 `UNICOM_DEVICE_ID`, `UNICOM_UNIQUE_IDENTIFIER` 等环境变量。
8. 从请求头 (`Request Headers`) 或 Cookies 部分获取 `c_version`, `channel`, `city` 等信息，用于设置对应的环境变量。

免责声明：
本脚本仅供学习和交流使用，请勿用于非法用途。使用本脚本造成的任何后果由使用者自行承担。
请尊重联通App的使用协议。
"""

import os
import requests
import time
import sys
import json # Added for PushPlus body
from datetime import datetime

# ANSI颜色码
COLOR_RESET = "\033[0m"
COLOR_RED = "\033[91m"
COLOR_GREEN = "\033[92m"
COLOR_YELLOW = "\033[93m"
COLOR_BLUE = "\033[94m"
COLOR_PURPLE = "\033[95m"
COLOR_CYAN = "\033[96m"
COLOR_WHITE = "\033[97m"
COLOR_BOLD = "\033[1m"
COLOR_UNDERLINE = "\033[4m"

# 定义环境变量名称 (输入)
ENV_MOBILE_ENCRYPTED = 'UNICOM_MOBILE_ENCRYPTED'
ENV_PASSWORD_ENCRYPTED = 'UNICOM_PASSWORD_ENCRYPTED'
ENV_DEVICE_ID = 'UNICOM_DEVICE_ID' # Used for deviceId/Code in login body and imei in signin
ENV_UNIQUE_IDENTIFIER = 'UNICOM_UNIQUE_IDENTIFIER'
ENV_PUSH_PLUS_TOKEN = 'PUSH_PLUS_TOKEN' # PushPlus Token

# 可选环境变量 (输入)
ENV_DEVICE_BRAND = 'UNICOM_DEVICE_BRAND'
ENV_DEVICE_MODEL = 'UNICOM_DEVICE_MODEL'
ENV_DEVICE_OS = 'UNICOM_DEVICE_OS'
ENV_APP_VERSION = 'UNICOM_APP_VERSION'
ENV_CHANNEL = 'UNICOM_CHANNEL'
ENV_CITY = 'UNICOM_CITY'
ENV_SIM_OPERATOR = 'UNICOM_SIM_OPERATOR'
ENV_IP_ADDRESS = 'UNICOM_IP_ADDRESS'

# 输出环境变量名称 (供其他脚本使用)
OUTPUT_COOKIE = 'UNICOM_COOKIE'
OUTPUT_TOKEN_ONLINE = 'UNICOM_TOKEN_ONLINE'
OUTPUT_PRIVATE_TOKEN = 'UNICOM_PRIVATE_TOKEN'

# --- 接口信息 ---
LOGIN_URL = "https://m.client.10010.com/mobileService/login.htm"
SIGNIN_PAGE_URL = 'https://img.client.10010.com/SigininApp/index.html'
CONTINUOUS_SIGN_URL = 'https://activity.10010.com/sixPalaceGridTurntableLottery/signin/getContinuous'
DAY_SIGN_URL = 'https://activity.10010.com/sixPalaceGridTurntableLottery/signin/daySign'
PUSHPLUS_URL = 'http://www.pushplus.plus/send' # PushPlus API URL

# 固定参数 (从抓包数据中获取，可能在不同App版本中变化，如果登录失败请检查这些值)
LOGIN_APP_ID = "2c3ac32a43c90c71330643da26f4251e22fdf2d262b4eea655a6bfa6a592f8dd5cdab4b89575094ca4e4f3c1c3937213c0935cd442bf78b59e6ff2960e069d6021763342e6f354ab3aef410c4eae75c72b3c146a9a679cb8f7cded239c9ba943"
LOGIN_KEY_VERSION = "2"
LOGIN_VOIP_TOKEN = "citc-default-token-do-not-push"
LOGIN_IS_FIRST_INSTALL = "1"
LOGIN_IS_REMEMBER_PWD = "false"
LOGIN_SIM_COUNT = "1"
LOGIN_NET_WAY = "wifi" # 或者 '4g', '5g'

SIGNIN_PAGE_PARAMS = {
    'cdncachetime': '2909378', # 这个值看起来像缓存时间戳，可能需要根据实际抓包更新
    'channel': 'wode',
    'webViewNavIsHidden': 'webViewNavIsHidden'
}
DAY_SIGN_PARAMS = {} # 根据提供的JS源码，签到POST参数是空的

# 辅助函数：打印带颜色的消息
def print_color(message, color=COLOR_RESET, bold=False):
    bold_code = COLOR_BOLD if bold else ""
    print(f"{color}{bold_code}{message}{COLOR_RESET}")
    sys.stdout.flush() # 刷新缓冲区，确保立即输出

# 获取环境变量
def get_env(name, required=True, default=None):
    value = os.getenv(name, default)
    if required and value is None:
        print_color(f"❌ {COLOR_RED}错误：请设置环境变量 {COLOR_BOLD}{name}{COLOR_RED}", COLOR_RED)
        exit(1)
    return value

# 辅助函数：带重试机制的请求
def retry_request(request_func, attempts=3, delay=5):
    for i in range(attempts):
        try:
            response = request_func()
            response.raise_for_status() # 检查HTTP状态码
            return response
        except requests.exceptions.RequestException as e:
            if i < attempts - 1:
                print_color(f"⚠️ 请求失败，第 {i + 1}/{attempts} 次重试... 错误: {e}", COLOR_YELLOW)
                time.sleep(delay)
            else:
                raise # 最后一次失败则抛出异常

# --- 发送PushPlus通知函数 ---
def send_notification(title, content):
    push_token = get_env(ENV_PUSH_PLUS_TOKEN, required=False)
    if not push_token:
        print_color("ℹ️ 未设置 PushPlus Token，跳过发送通知。", COLOR_BLUE)
        return

    print_color("\n📤 正在发送 PushPlus 通知...", COLOR_BLUE)

    headers = {
        'Content-Type': 'application/json'
    }
    payload = {
        "token": push_token,
        "title": title,
        "content": content,
        "channel": "wechat", # 默认微信通道
        "template": "txt" # 文本模板
    }

    try:
        response = requests.post(PUSHPLUS_URL, headers=headers, data=json.dumps(payload), timeout=10)
        response.raise_for_status()
        result = response.json()
        if result.get('code') == 200:
            print_color("✅ PushPlus 通知发送成功。", COLOR_GREEN)
        else:
            print_color(f"❌ PushPlus 通知发送失败：{result.get('msg', '未知错误')}", COLOR_RED)
    except requests.exceptions.RequestException as e:
        print_color(f"❌ 发送 PushPlus 通知时发生网络错误：{e}", COLOR_RED)
    except Exception as e:
        print_color(f"❌ 发送 PushPlus 通知时发生未知错误：{e}", COLOR_RED)


# --- 执行登录请求函数 ---
def perform_login():
    print_color(f"\n=== 中国联通自动登录 ===", color=COLOR_BOLD)
    print_color("ℹ️ 正在读取登录所需环境变量...", COLOR_BLUE)

    # 获取必填环境变量
    mobile_encrypted = get_env(ENV_MOBILE_ENCRYPTED)
    password_encrypted = get_env(ENV_PASSWORD_ENCRYPTED)
    device_id = get_env(ENV_DEVICE_ID)
    unique_identifier = get_env(ENV_UNIQUE_IDENTIFIER)

    # 获取可选环境变量或使用默认值 (不打印读取日志，减少输出)
    device_brand = get_env(ENV_DEVICE_BRAND, required=False, default="iPhone")
    device_model = get_env(ENV_DEVICE_MODEL, required=False, default="iPhone8,2")
    device_os = get_env(ENV_DEVICE_OS, required=False, default="15.8.3")
    app_version = get_env(ENV_APP_VERSION, required=False, default="iphone_c@12.0200")
    channel = get_env(ENV_CHANNEL, required=False, default="GGPD")
    city = get_env(ENV_CITY, required=False, default="074|742")
    sim_operator = get_env(ENV_SIM_OPERATOR, required=False, default="--,%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8,--,--,--")
    ip_address = get_env(ENV_IP_ADDRESS, required=False, default="192.168.5.14")

    print_color("\n🚀 尝试使用加密手机号进行登录...", COLOR_YELLOW)

    # 动态生成请求时间
    req_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # 构建请求体
    payload = {
        "voipToken": LOGIN_VOIP_TOKEN,
        "deviceBrand": device_brand,
        "simOperator": sim_operator,
        "deviceId": device_id,
        "netWay": LOGIN_NET_WAY,
        "deviceCode": device_id,
        "deviceOS": device_os,
        "uniqueIdentifier": unique_identifier,
        "latitude": "",
        "version": app_version,
        "pip": ip_address,
        "isFirstInstall": LOGIN_IS_FIRST_INSTALL,
        "remark4": "",
        "keyVersion": LOGIN_KEY_VERSION,
        "longitude": "",
        "simCount": LOGIN_SIM_COUNT,
        "mobile": mobile_encrypted,
        "isRemberPwd": LOGIN_IS_REMEMBER_PWD,
        "appId": LOGIN_APP_ID,
        "reqtime": req_time,
        "deviceModel": device_model,
        "password": password_encrypted
    }

    # 构建请求头
    headers = {
        "Host": "m.client.10010.com",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/x-www-form-urlencoded",
        "Connection": "keep-alive",
        "Accept": "*/*",
        "User-Agent": f"ChinaUnicom4.x/12.2 (com.chinaunicom.mobilebusiness; build:44; iOS {device_os}) Alamofire/4.7.3 unicom{{version:{app_version}}}",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    }

    # 发送登录请求
    try:
        print_color(f"🌐 正在发送登录请求到 {LOGIN_URL}...", COLOR_BLUE)
        response = retry_request(lambda: requests.post(LOGIN_URL, data=payload, headers=headers, timeout=10))

        # 尝试解析JSON响应
        try:
            data = response.json()
            print_color(f"✅ 接收到响应：HTTP状态码 {response.status_code}, 业务码: {COLOR_BOLD}{data.get('code')}{COLOR_RESET}{COLOR_GREEN}, 描述: {data.get('desc')}", COLOR_GREEN)

            if data.get("code") == "0" or data.get("code") == "0000":
                print_color("\n✨ 登录成功！正在提取并导出凭证...", COLOR_GREEN)

                # 提取Cookies
                all_cookies = response.cookies
                cookie_string = ""
                account_phone = "" # 用于通知中的手机号
                for cookie in all_cookies:
                     cookie_string += f"{cookie.name}={cookie.value}; "
                     if cookie.name == 'u_account':
                          account_phone = cookie.value
                cookie_string = cookie_string.strip().rstrip(';')

                # 提取JSON体中的Tokens
                token_online = data.get("token_online", "")
                private_token = data.get("private_token", "")

                print_color(f"\n--- 导出环境变量 (供其他独立任务使用) ---", color=COLOR_PURPLE, bold=True)
                print_color(f"ℹ️ 青龙面板会自动识别并设置这些变量。", COLOR_BLUE)

                # 导出Cookies (必须是裸露的print语句)
                print(f'export {OUTPUT_COOKIE}="{cookie_string}"')
                # 导出JSON Tokens (必须是裸露的print语句)
                print(f'export {OUTPUT_TOKEN_ONLINE}="{token_online}"')
                print(f'export {OUTPUT_PRIVATE_TOKEN}="{private_token}"')

                print_color(f"--- 环境变量导出完成 ---", color=COLOR_PURPLE, bold=True)

                login_message = f"✅ 登录成功！账号: {account_phone if account_phone else '未知'}"
                # 返回提取到的凭证和登录消息
                return True, cookie_string, device_id, token_online, private_token, login_message

            else:
                login_message = f"❌ 登录失败！业务处理未成功。"
                error_details = f"业务码: {data.get('code')}, 描述: {data.get('desc')}"
                print_color(f"\n{login_message} {error_details}", COLOR_RED)
                print_color(f"请检查输入的加密手机号、密码和设备信息是否正确。", COLOR_YELLOW)
                return False, None, None, None, None, f"{login_message}\n{error_details}"

        except requests.exceptions.JSONDecodeError:
            login_message = f"❌ 登录响应不是有效的JSON格式！"
            error_details = f"HTTP状态码: {response.status_code}"
            print_color(f"\n{login_message} {error_details}", COLOR_RED)
            print_color("请检查抓包中的响应内容，确认接口是否返回了预期的数据。", COLOR_YELLOW)
            return False, None, None, None, None, f"{login_message}\n{error_details}"

    except requests.exceptions.RequestException as e:
        login_message = f"❌ 登录请求发生网络错误：{e}"
        print_color(f"\n{login_message}", COLOR_RED)
        print_color("请检查网络连接或目标服务器是否可达。", COLOR_YELLOW)
        return False, None, None, None, None, login_message
    except Exception as e:
        login_message = f"❌ 登录时发生未知错误：{e}"
        print_color(f"\n{login_message}", COLOR_RED)
        print_color("请检查脚本代码或运行环境。", COLOR_YELLOW)
        return False, None, None, None, None, login_message

# --- 执行签到页面请求函数 ---
def perform_signin_page_request(cookie_string):
    print_color(f"\n--- 【访问签到页面】开始 ---", COLOR_CYAN)
    headers = {
        'Host': 'img.client.10010.com',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cookie': cookie_string,
        'User-Agent': os.getenv(ENV_APP_VERSION, "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@12.0200}"),
        'Referer': 'https://img.client.10010.com/'
    }
    try:
        response = retry_request(lambda: requests.get(SIGNIN_PAGE_URL, params=SIGNIN_PAGE_PARAMS, headers=headers, timeout=10))

        # 精简成功日志
        if response.status_code == 200:
             print_color(f"🌐 访问签到页面 | 响应状态码: {response.status_code} ✅", COLOR_GREEN)
             return True, "✅ 访问签到页面成功"
        else:
             print_color(f"❌ 访问签到页面 | 响应状态码: {response.status_code} ❌", COLOR_RED)
             return False, f"❌ 访问签到页面失败，状态码: {response.status_code}"

    except requests.exceptions.RequestException as e:
        print_color(f"❌ 访问签到页面 | 发生异常！错误信息: {e}", COLOR_RED)
        return False, f"❌ 访问签到页面异常: {e}"
    except Exception as e:
        print_color(f"❌ 访问签到页面 | 发生未知错误：{e}", COLOR_RED)
        return False, f"❌ 访问签到页面未知错误: {e}"
    finally:
        print_color("--- 【访问签到页面】结束 ---", COLOR_CYAN)

# --- 执行连续签到信息请求函数 ---
def perform_continuous_sign_request(cookie_string, device_id):
    print_color(f"\n--- 【获取连续签到信息】开始 ---", COLOR_CYAN)
    headers = {
        'Host': 'activity.10010.com',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cookie': cookie_string,
        'User-Agent': os.getenv(ENV_APP_VERSION, "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@12.0200}"),
        'Origin': 'https://img.client.10010.com',
        'Referer': 'https://img.client.10010.com/'
    }
    params = {
        'taskId': '',
        'channel': 'wode',
        'imei': device_id
    }
    try:
        response = retry_request(lambda: requests.get(CONTINUOUS_SIGN_URL, params=params, headers=headers, timeout=10))

        print_color(f"🌐 获取连续签到信息 | 响应状态码: {response.status_code}", COLOR_GREEN if response.status_code == 200 else COLOR_RED)

        data = response.json()
        print_color(f"📊 业务响应码: {COLOR_BOLD}{data.get('code')}{COLOR_RESET}{COLOR_GREEN}, 描述: {data.get('desc')}", COLOR_GREEN)

        if data and data.get('code') == '0000':
            info_data = data.get('data', {})
            print_color(f"✅ 获取连续签到信息 | 成功！", COLOR_GREEN)
            continue_count = info_data.get('continueCount', '未知')
            today_signed = info_data.get('todayIsSignIn', 'n') == 'y'
            keep_desc = info_data.get('keepDesc')
            print_color(f"📊 连续签到天数: {continue_count}天, 今日是否已签到: {'是' if today_signed else '否'}", COLOR_GREEN)
            if keep_desc:
                print_color(f"🎁 连续签到奖励: {keep_desc}", COLOR_GREEN)
            check_message = f"✅ 获取签到信息成功 | 连续签到{continue_count}天, 今日{'已' if today_signed else '未'}签到"
            if keep_desc: check_message += f", 奖励: {keep_desc}"
            return True, today_signed, check_message
        elif data and data.get('code') == '0001':
            check_message = f"❌ 获取签到信息失败 | 错误原因：{data.get('desc', '未知')}"
            print_color(check_message, COLOR_RED)
            print_color("❌ 疑似用户未登录或 Cookie 已失效，请重新登录 App 并更新 UNICOM_COOKIE。", COLOR_RED)
            return False, False, check_message
        else:
            check_message = f"❌ 获取签到信息失败 | 响应代码: {data.get('code', '未知')}, 描述: {data.get('desc', '未知')}"
            print_color(check_message, COLOR_RED)
            return False, False, check_message

    except requests.exceptions.RequestException as e:
        check_message = f"❌ 获取签到信息异常: {e}"
        print_color(check_message, COLOR_RED)
        return False, False, check_message
    except requests.exceptions.JSONDecodeError:
        check_message = f"❌ 获取签到信息响应不是有效的JSON格式！"
        print_color(check_message, COLOR_RED)
        return False, False, check_message
    except Exception as e:
        check_message = f"❌ 获取签到信息未知错误: {e}"
        print_color(check_message, COLOR_RED)
        return False, False, check_message
    finally:
        print_color("--- 【获取连续签到信息】结束 ---", COLOR_CYAN)

# --- 执行签到请求函数 ---
def perform_day_sign_request(cookie_string):
    print_color(f"\n--- 【执行每日签到】开始 ---", COLOR_CYAN)
    headers = {
        'Host': 'activity.10010.com',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cookie': cookie_string,
        'User-Agent': os.getenv(ENV_APP_VERSION, "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@12.0200}"),
        'Origin': 'https://img.client.10010.com',
        'Referer': 'https://img.client.10010.com/',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    params = DAY_SIGN_PARAMS
    try:
        response = retry_request(lambda: requests.post(DAY_SIGN_URL, data=params, headers=headers, timeout=10))

        print_color(f"🌐 执行每日签到 | 响应状态码: {response.status_code}", COLOR_GREEN if response.status_code == 200 else COLOR_RED)

        data = response.json()
        print_color(f"📊 业务响应码: {COLOR_BOLD}{data.get('code')}{COLOR_RESET}{COLOR_GREEN}, 描述: {data.get('desc')}", COLOR_GREEN)

        if data and data.get('code') == '0000':
            sign_data = data.get('data', {})
            sign_message = f"✅ 每日签到成功！"
            status_desc = sign_data.get('statusDesc', '无描述')
            sign_message += f" {status_desc}"
            print_color(sign_message, COLOR_GREEN)

            rewards = []
            red_reward = sign_data.get('redSignMessage')
            if red_reward:
                rewards.append(f"获得奖励: {red_reward}")
            black_reward = sign_data.get('blackSignMessage')
            if black_reward:
                rewards.append(f"额外奖励: {black_reward}")
            flower_count = sign_data.get('flowerCount')
            if flower_count is not None:
                 rewards.append(f"花朵数量: {flower_count}")
            growth_v = sign_data.get('growthV')
            if growth_v is not None:
                 rewards.append(f"成长值: {growth_v}")

            if rewards:
                rewards_str = ", ".join(rewards)
                print_color(f"🎁 {rewards_str}", COLOR_GREEN)
                sign_message += f"\n🎁 {rewards_str}"

            return True, sign_message

        elif data and data.get('code') == '0002' and isinstance(data.get('desc'), str) and '已经签到' in data.get('desc', ''):
            sign_message = f"✅ 每日签到 | 今日已完成签到！"
            print_color(sign_message, COLOR_GREEN)
            return True, sign_message
        elif data and data.get('code') == '0001':
            sign_message = f"❌ 每日签到失败！错误原因：{data.get('desc', '未知')}"
            print_color(sign_message, COLOR_RED)
            print_color("❌ 疑似用户未登录或 Cookie 已失效。", COLOR_RED)
            return False, sign_message
        else:
            sign_message = f"❌ 每日签到失败！响应代码: {data.get('code', '未知')}, 描述: {data.get('desc', '未知')}"
            print_color(sign_message, COLOR_RED)
            return False, sign_message

    except requests.exceptions.RequestException as e:
        sign_message = f"❌ 每日签到异常: {e}"
        print_color(sign_message, COLOR_RED)
        return False, sign_message
    except requests.exceptions.JSONDecodeError:
        sign_message = f"❌ 每日签到响应不是有效的JSON格式！"
        print_color(sign_message, COLOR_RED)
        return False, sign_message
    except Exception as e:
        sign_message = f"❌ 每日签到未知错误: {e}"
        print_color(sign_message, COLOR_RED)
        return False, sign_message
    finally:
        print_color("--- 【执行每日签到】结束 ---", COLOR_CYAN)


# --- 主程序入口 ---
if __name__ == "__main__":
    # 存储所有通知消息的列表
    notification_messages = []
    script_start_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    notification_messages.append(f"脚本开始运行: {script_start_time}")

    # 步骤1: 执行登录
    login_success, cookie, device_id_val, token_online, private_token, login_msg = perform_login()
    notification_messages.append(login_msg)

    if login_success:
        print_color("\n" + "="*40, color=COLOR_BOLD) # 分隔线
        print_color(f"\n=== 联通签到流程开始 ===", color=COLOR_BOLD)
        notification_messages.append("\n--- 签到流程 ---")

        # 步骤2: 访问签到页面 (可选)
        # 即使访问失败，也尝试继续后续步骤
        _, signin_page_msg = perform_signin_page_request(cookie)
        # notification_messages.append(signin_page_msg) # 访问页面成功/失败不太重要，不加入通知内容

        time.sleep(1) # 间隔1秒

        # 步骤3: 获取连续签到信息，并检查今日是否已签到
        success_check, already_signed, check_msg = perform_continuous_sign_request(cookie, device_id_val)
        notification_messages.append(check_msg)


        if success_check:
            if not already_signed:
                print_color("\n➡️ 检测到今日未签到，准备执行每日签到...", COLOR_YELLOW)
                time.sleep(1) # 间隔1秒
                # 步骤4: 执行每日签到
                sign_success, sign_msg = perform_day_sign_request(cookie)
                notification_messages.append(sign_msg)
            else:
                print_color("\nℹ️ 今日已签到，无需重复签到。", COLOR_BLUE)
                # 签到信息检查函数已经添加了已签到的消息，无需额外添加
        else:
            print_color("\n❌ 无法获取签到状态，跳过签到操作。", COLOR_RED)
            # 签到信息检查函数已经添加了失败的消息，无需额外添加

        print_color(f"\n=== 联通签到流程结束 ===", color=COLOR_BOLD)
        print_color("\n" + "="*40, color=COLOR_BOLD) # 分隔线

    else:
        print_color("\n❌ 登录失败，无法执行后续操作。", COLOR_RED)
        # 登录函数已经添加了失败的消息，无需额外添加

    print_color(f"\n=== 脚本运行结束 ===", color=COLOR_BOLD)
    script_end_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    notification_messages.append(f"\n脚本运行结束: {script_end_time}")

    # 整合所有消息发送通知
    full_notification_content = "\n".join(notification_messages)
    notification_title = "联通登录签到脚本运行结果"
    send_notification(notification_title, full_notification_content)
import os
import requests
import re
from bs4 import BeautifulSoup

# --- 配置信息 (通过环境变量获取) ---
# MUDAIIBA_ACCOUNTS: 字符串，包含多个用户账户信息，格式如下：
# "邮箱1&MD5密码1&bbs_token1
# 邮箱2&MD5密码2&bbs_token2"
ACCOUNTS_STR = os.getenv("MUDAIIBA_ACCOUNTS")

# --- 基础URL及路径 ---
BASE_URL = "https://www.mudaiba.com"
SIGN_PATH = "/my-score_sign.htm"
SCORE_PATH = "/my-score.htm"

def log(message):
    """美化后的日志输出函数，带🎁符号"""
    print(f"🎁 {message}")

def log_section(title):
    """用于分割不同账户任务的日志标题"""
    print(f"\n{'='*50}\n🎁 {title}\n{'='*50}\n")

def send_notification(title, content):
    """发送通知的函数"""
    try:
        from notify import send as notify_send
        notify_send(title, content)
        log("通知发送成功")
    except ImportError:
        log("未找到通知模块，跳过通知发送")
    except Exception as e:
        log(f"发送通知时出错: {e}")

def get_common_headers(referer_path="/"):
    """获取通用的请求头"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        "Accept": "text/plain, */*; q=0.01",
        "DNT": "1",
        "Origin": BASE_URL,
        "Sec-Fetch-Site": "same-origin",
        "Referer": BASE_URL + referer_path,
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Priority": "u=1, i"
    }
    if "my-score" in referer_path or "my.htm" in referer_path:
        headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        headers["Sec-Fetch-Dest"] = "document"
        headers["Upgrade-Insecure-Requests"] = "1"
        headers["Sec-Fetch-Mode"] = "navigate"
        headers["Sec-Fetch-User"] = "?1"
        headers.pop("X-Requested-With", None)
    else:
        headers["X-Requested-With"] = "XMLHttpRequest"
        headers["Sec-Fetch-Mode"] = "cors"
        headers["Sec-Fetch-Dest"] = "empty"
    return headers

def sign_in(bbs_token):
    """尝试使用bbs_token进行签到"""
    log("尝试直接签到...")
    
    cookies = {"bbs_token": bbs_token}
    headers = get_common_headers(referer_path="/")

    try:
        response = requests.post(
            url=BASE_URL + SIGN_PATH,
            headers=headers,
            cookies=cookies,
            data={}
        )
        response.raise_for_status()

        resp_json = response.json()
        if resp_json.get("code") == "0":
            message = f"签到成功！消息: {resp_json.get('message', '未知')}"
            log(message)
            return True, message
        else:
            message = f"签到失败！代码: {resp_json.get('code')}, 消息: {resp_json.get('message', '未知')}"
            log(message)
            if "登录" in resp_json.get("message", ""):
                log("可能原因：bbs_token已过期或无效。")
            return False, message
    except requests.exceptions.RequestException as e:
        message = f"签到请求发生网络错误: {e}"
        log(message)
        return False, message
    except ValueError:
        message = f"签到响应解析失败: {response.text}"
        log(message)
        return False, message

def get_user_score(bbs_token):
    """使用bbs_token获取用户个人积分信息"""
    log("尝试获取个人积分信息...")
    cookies = {"bbs_token": bbs_token}
    headers = get_common_headers(referer_path="/my.htm")

    try:
        response = requests.get(
            url=BASE_URL + SCORE_PATH,
            headers=headers,
            cookies=cookies
        )
        response.raise_for_status()

        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')
        score_table = soup.find('table', class_='table mb-0')
        
        if not score_table:
            message = "未找到积分信息表格，HTML结构可能已改变或bbs_token无效。"
            log(message)
            if "登录" in html_content or "请登录" in html_content:
                log("可能原因：bbs_token已过期或无效，请重新登录获取。")
            return None, message

        score_row = score_table.find('tbody').find('tr')
        if not score_row:
            message = "未找到积分信息行，HTML结构可能已改变。"
            log(message)
            return None, message

        tds = score_row.find_all('td')
        if len(tds) < 3:
            message = "积分信息列数不足，HTML结构可能已改变。"
            log(message)
            return None, message

        experience_text = tds[0].get_text(strip=True)
        gold_text = tds[1].get_text(strip=True)
        ingot_text = tds[2].get_text(strip=True)

        experience = re.search(r'经验：(\d+)点', experience_text)
        gold = re.search(r'金币：(\d+)枚', gold_text.split('\n')[0])
        ingot = re.search(r'元宝：(\d+)个', ingot_text)

        scores = {
            '经验': int(experience.group(1)) if experience else 'N/A',
            '金币': int(gold.group(1)) if gold else 'N/A',
            '元宝': int(ingot.group(1)) if ingot else 'N/A'
        }
        message = f"当前积分信息：经验 {scores['经验']}点, 金币 {scores['金币']}枚, 元宝 {scores['元宝']}个"
        log(message)
        return scores, message

    except requests.exceptions.RequestException as e:
        message = f"获取积分请求发生网络错误: {e}"
        log(message)
        return None, message
    except Exception as e:
        message = f"解析积分信息时发生未知错误: {e}"
        log(message)
        log("请检查母带吧网站HTML结构是否发生变化，或bbs_token是否有效。")
        return None, message

def main():
    if not ACCOUNTS_STR:
        error_msg = "错误：未设置 MUDAIIBA_ACCOUNTS 环境变量！请按照说明设置多用户账户信息。"
        log(error_msg)
        send_notification("母带吧签到失败", error_msg)
        return

    # 解析多用户字符串（使用换行符分隔）
    account_lines = [line.strip() for line in ACCOUNTS_STR.splitlines() if line.strip()]
    
    if not account_lines:
        error_msg = "错误：MUDAIIBA_ACCOUNTS 环境变量为空或格式不正确，未能解析到账户信息。"
        log(error_msg)
        send_notification("母带吧签到失败", error_msg)
        return

    log_section("开始执行母带吧所有账户任务...")
    notification_title = "母带吧签到结果"
    notification_content = []
    success_count = 0
    total_accounts = len(account_lines)

    for i, line in enumerate(account_lines):
        parts = [p.strip() for p in line.split("&")]
        
        email = parts[0] if len(parts) > 0 else ""
        password_md5 = parts[1] if len(parts) > 1 else ""
        bbs_token = parts[2] if len(parts) > 2 else ""

        log_section(f"开始处理第 {i+1} 个账户: {email if email else '未知邮箱'}")
        account_notification = f"账户: {email if email else '未知邮箱'}\n"

        if not email or not password_md5 or not bbs_token:
            error_msg = "警告：当前账户配置不完整 (缺少邮箱、MD5密码 或 bbs_token)，跳过此账户。"
            log(error_msg)
            log("请检查 MUDAIIBA_ACCOUNTS 环境变量中此账户的格式是否为 '邮箱&MD5密码&bbs_token'")
            account_notification += error_msg
            notification_content.append(account_notification)
            continue

        # 1. 尝试使用已有的bbs_token进行签到
        sign_success, sign_message = sign_in(bbs_token)
        account_notification += f"签到: {'成功 ✅' if sign_success else '失败 ❌'}\n"
        if sign_success:
            success_count += 1

        # 2. 获取积分信息
        log("---")
        score_info, score_message = get_user_score(bbs_token)
        account_notification += f"积分: {score_message}\n"
        log("---")

        if not sign_success:
            error_msg = "!!! 签到失败。可能原因：bbs_token已过期或无效\n!!! 请手动访问母带吧网站更新token"
            log(error_msg)
            account_notification += error_msg + "\n"
        
        notification_content.append(account_notification)
        log(f"第 {i+1} 个账户 ({email if email else '未知邮箱'}) 任务执行完毕。")
    
    # 构建最终通知
    final_title = f"母带吧签到结果 ({success_count}/{total_accounts} 成功)"
    final_content = "\n\n".join(notification_content)
    
    log_section("所有账户任务执行完毕。")
    log(f"汇总信息:\n{final_content}")
    send_notification(final_title, final_content)


if __name__ == "__main__":
    main()
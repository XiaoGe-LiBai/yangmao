import os
import requests

message = ''
# 本地测试用环境变量设置
os.environ['dmlck'] = ''

if not os.environ.get('dmlck'):
    print('叼毛CK都没跑个毛啊？')
else:
    accounts_list = os.environ.get('dmlck').split('&')

    num_of_accounts = len(accounts_list)
    print(f"获取到 {num_of_accounts} 个账号")

    for i, account in enumerate(accounts_list, start=1):
        values = account.split(',')
        if len(values) < 1:
            print(f"账号 {i} 的 Cookie 数据格式错误，跳过")
            continue

        Cookie = values[0]
        print(f"\n=======达美乐开始执行账号{i}=======")

        url = "https://game.dominos.com.cn/abalone/game/gameDone"
        payload = f"openid={Cookie}&score=d8XtWSEx0zRy%2BxdeJriXZeoTek6ZVZdadlxdTFiN9yrxt%2BSIax0%2BRccbkObBZsisYFTquPg%2FG2cnGPBlGV2f32C6D5q3FFhgvcfJP9cKg%2BXs6l7J%2BEcahicPml%2BZWp3P4o1pOQvNdDUTQgtO6NGY0iijZ%2FLAmITy5EJU8dAc1EnbvhOYG36Qg1Ji4GDRoxAfRgmELvpLM6JSFlCEKG2C2s%2BJCevOJo7kwsLJCvwbVgeewhKSAyCZYnJQ4anmPgvrv6iUIiFQP%2Bj6%2B5p1VETe5xfawQ4FQ4w0mttXP0%2BhX39n1dzDrfcSkYkUaWPkIFlHAX7QPT3IgG6MhIKCvB%2BUcw%3D%3D&tempId=16408240716151126162"

        headers = {
            'User-Agent': "Mozilla/5.0 (Linux; Android 12; M2012K11AC Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220133 MMWEBSDK/20240404 MMWEBID/8518 MicroMessenger/8.0.49.2600(0x2800313D) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
            'Accept-Encoding': "gzip,compress,br,deflate",
            'Content-Type': "application/x-www-form-urlencoded",
            'charset': "utf-8",
            'Referer': "https://servicewechat.com/wx887bf6ad752ca2f3/63/page-frame.html"
        }

        while True:
            try:
                shrurl = "https://game.dominos.com.cn/abalone/game/sharingDone"
                payload2 = f"openid={Cookie}&from=1&target=0"
                res = requests.post(shrurl, data=payload2, headers=headers).json()
                if res.get('errorMessage') == "今日分享已用完，请明日再来":
                    print(f'账号{i}分享已达上限，明天再来吧')
                    break
            except Exception as e:
                print(f"账号 {i} 分享请求失败: {str(e)}")
                break

        for a in range(3):
            try:
                response = requests.post(url, data=payload, headers=headers)
                response_data = response.json()
                if response_data.get("statusCode") == 0:
                    prize = response_data['content']['name']
                    print(f"\n账号{i}\n{prize}")
                    message += f"\n{prize}"
                    if '一等奖' in prize:
                        print(f"账号{i}获得大奖：{prize}")
                else:
                    err = response_data.get('errorMessage', '未知错误')
                    print(f"账号{i} 错误: {err}")
                    message += f'\n账号{i}\n {err}'
                    break
            except Exception as e:
                print(f"账号 {i} 游戏请求失败: {str(e)}")
                break
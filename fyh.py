"""
脚本名称：复游会（托迈酷客）
活动规则：每日签到可获得积分
环境变量：ThomasCook_Cookie=Authorization
host： apis.folidaymall.com   取出Authorization参数
cron 15 10,16 * * *
"""

######################################################################################################################################################
import os
import requests
from dotenv import load_dotenv
load_dotenv()
accounts = os.getenv('ThomasCook_Cookie')
if accounts is None:
    print('你没有填入ThomasCook_Cookie，咋运行？')
else:
    accounts_list = os.environ.get('ThomasCook_Cookie').split('@')
    num_of_accounts = len(accounts_list)
    print(f"获取到 {num_of_accounts} 个账号")
    for i, account in enumerate(accounts_list, start=1):
        values = account.split(',')
        Authorization = values[0]
        print(f"\n=======开始执行账号{i}=======")
        url = "https://apis.folidaymall.com/online/cms-api/sign/userSign"
        headers = {
            "host": "apis.folidaymall.com",
            "Authorization": Authorization,
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003130) NetType/WIFI Language/zh_CN miniProgram/wx1fa4da2889526a37"
        }
        r = requests.get(url=url, headers=headers).json()
        if r["responseCode"] == "0":
            mobile = r['data']['signInfo']['mobile']
            if r['data']['signInfo']['signInStatus'] == 0:
                zong = eval(f"{r['data']['signInfo']['currentIntegral']} + {r['data']['signInfo']['changeIntegeral']}")

                print(
                    f"账号【{mobile}】🎉签到成功\n已连续签到{r['data']['signInfo']['continousSignDays']}天\n当前总积分：{zong}")

            elif r['data']['signInfo']['signInStatus'] == 1:
                print(
                    f"账号【{mobile}】🎉已签到！明天再来吧\n已连续签到{r['data']['signInfo']['continousSignDays']}天\n当前总积分：{r['data']['signInfo']['currentIntegral']}")
        else:
            print(f"❌❌❌❌❌{r}")

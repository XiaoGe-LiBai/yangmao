"""
脚本名称：金多多
活动规则：每日签到 任务 一天1.5r 满5提现
环境变量：jddck=Cookie
host： https://www.jindd.shop   取出Cookie参数
cron：31 7,13,16 * * *

"""
###############################################################################
import os
import time
import requests


accounts = os.getenv('jddck')
if accounts is None:
    print('你没有填入jddck，咋运行？')
else:
    accounts_list = os.environ.get('jddck').split('@')
    num_of_accounts = len(accounts_list)
    print(f"获取到 {num_of_accounts} 个账号")
    for i, account in enumerate(accounts_list, start=1):
        values = account.split(',')
        Cookie = values[0]
        print(f"\n=======开始执行账号{i}=======")

        url = "https://www.jindd.shop/addons/yun_shop/api.php"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090a13) XWEB/9129 Flue",
            "Cookie": Cookie
        }

        data = {
            "i": "12",
            "uuid": "0",
            "type": "1",
            "version": "v1.1.137",
            "basic_info": "1",
            "route": "member.member.wxJsSdkConfig",
        }

        response = requests.post(url, headers=headers, json=data).json()
        if response['result'] == 1:
            print(f"账号【{response['data']['info']['nickname']}---{response['data']['info']['uid']}】")
            url = "https://www.jindd.shop/addons/yun_shop/api.php"
            data['route'] = "plugin.sign.Frontend.Modules.Sign.Controllers.sign.sign"
            response = requests.post(url, headers=headers, json=data).json()
            if response['result'] == 1:
                print(f"签到成功🎉获得{response['data']['amount']}元宝")
            elif response['result'] == 0:
                print(f"{response['msg']}🎉")
            else:
                print(f"{response}")
                break

            for i in range(5):
                url = "https://www.jindd.shop/addons/yun_shop/api.php"
                data['route'] = "plugin.qmtask.api.qmtask.confirm_qmtask"
                response = requests.post(url, headers=headers, json=data).json()
                if response['msg'] == "任务变更成功!":
                    print(f"浏览任务第{i + 1}次完成！")
                    time.sleep(2)
                else:
                    print(response['msg'])
                    break
            url = "https://www.jindd.shop/addons/yun_shop/api.php"
            data['route'] = "plugin.love.Frontend.Controllers.page.index"
            response = requests.get(url, headers=headers, json=data).json()
            if response['result'] == 1:
                print(f"当前可提现金额：{response['data']['usable']}元")
            else:
                print(response)
        else:
            print(f"{response}")

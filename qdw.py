"""
脚本名称：七点五饮用天然矿泉水_小程序
活动规则：每日签到可获得积分 兑换狂犬水
环境变量：qdw_sid=sid
host： https://h5.youzan.com   取出sid参数
cron：31 7,13,16 * * *

"""
###############################################################################
import time
import os
import requests


accounts = os.getenv('qdw_sid')
if accounts is None:
    print('你没有填入qdw_sid，咋运行？')
else:
    accounts_list = os.environ.get('qdw_sid').split('@')
    num_of_accounts = len(accounts_list)
    print(f"获取到 {num_of_accounts} 个账号")
    for i, account in enumerate(accounts_list, start=1):
        values = account.split(',')
        sid = values[0]
        print(f"\n=======开始执行账号{i}=======")

        url = "https://h5.youzan.com/wscump/checkin/checkinV2.json"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a13) XWEB/9129",
            "Content-Type": "application/json",
            "Extra-Data": '{"is_weapp":1,"sid":"' + sid + '","version":"2.173.6","client":"weapp","bizEnv":"wsc","ftime":%d}' % int(
                time.time() * 1000)
        }
        params = {
            "checkinId": "3997371",
        }
        response = requests.get(url, headers=headers, params=params).json()
        if response['code'] == 1000030071:
            print('今天已经签到过啦🎉明天再来吧!')
        elif response['code'] == 0:
            print(f"签到成功🎉获得{response['data']['list'][0]['infos']['title']}!")
        else:
            print(response)

        url="https://h5.youzan.com/wscump/checkin/get_activity_by_yzuid_v2.json"
        re = requests.get(url, headers=headers,params=params).json()
        url = 'https://h5.youzan.com/wscuser/membercenter/init-data.json'
        response = requests.get(url, headers=headers).json()
        if response['code']==0:
            print(f"账号【{str(sid)[:18]}】 连续签到【{re['data']['continuesDay']}天】\n当前可用积分:{response['data']['member']['stats']['points']}")


import datetime
import requests


msg = []
QYWX_AM = ''  # corpid,corpsecret,touser,agentid
push = 1 # 0 不推送 1推送


config = [
    {
        'name': '大号',#随意
        'ck': ';video_omgid=33e1336edb9a2e47c4398b55d998ace04d300010217116;guid=6924db61c35b11eb89cd6c92bf48bcb2;vuserid=133363377;video_platform=3;video_appid=1000005;vdevice_qimei36=f8ec360b3c8d0da19d335cf0100016a17508;vqq_appid=101795054;vqq_openid=B46D436B2519053D3C7CC95A3D1D8DD0;vqq_access_token=F732130C43DA3235A0CDFF17DC3EEEE5;vqq_vuserid=133363377;main_login=qq;plat_bucketid=508;recommend_switch_value=0;recommend_setting_code=30;deviceName=Mi%2010%20Pro;systemVersion=13;manufacturer=Xiaomi;vversion_name=8.2.95;vcuid=9009518256;pgv_pvid=c57e6c46c24512f8;ptag=any;higgs_strategy_id=;higgs_strategy_plan_id=;app_ver_all=8.8.80.27455;webCore=x5;omgid=33e1336edb9a2e47c4398b55d998ace04d300010217116;omgbizid=;hasNotchInScreen=1;screenWidth=393;screenHeight=851;qimei36=f8ec360b3c8d0da19d335cf0100016a17508;pt=8;qua=QQLiveBrowser_8.8.80.27455_123;platform=Android;app_ver=8.8.80;vusession=VSYrSRVlPguigux9UOpmmA.N;vqq_vusession=VSYrSRVlPguigux9UOpmmA.N;call_type=1;isDarkMode=1;ip=36.112.186.23;usid=1689697587742608;us_stamp=168969758774;ussn=1622608293418392;teenGuardSessionCode=9CDE93A6419EEEEDB31E1E17DAC637E718655C2121FA30C32F554C4DCA3ED9FDB16F37477390CB8EE9FA4F17564CF545500AD8BE461D0E1EFA3016FE88238A937C7D552B54728ACDD8AF12DA7484D1FE9BE431403DCD2F3D4D11C49A837417FDD3A8C028B15D4B3D169EFC4A;turing_ticket=0101A7BE38C21FCEF6006DDEE2903516630749322C323FC78AC8FE1CAC729743287420EC6A6BC9CAF58F7E01;ctime=1689697614594;zdtime=1689697614353;captcha_ticket=t03XI03ER_slovmghX5bFwYTzZTKyziZEfGKgWW5G-H9s2r9FARc9OfQkCtpMlYZw8KudSXFsVZLUTsbnaiDoNGF2cl3sE1BnuCY2mxcNxcpnlGvUyQnFLYeg**;captcha_code=%40qLG',
        'ua': 'Mozilla/5.0 (Linux; Android 13; Mi 10 Pro Build/TKQ1.220829.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046247 Mobile Safari/537.36 QQLiveBrowser/8.8.80.27455',
        # 不是主设备ua容易出现滑块
    }
    ,
    # {
    #     'name': '',
    #     'ck': '',
    #     'ua': '',
    # }
]


def tx(ck, ua, name):
    global hai
    url = 'https://vip.video.qq.com/rpc/trpc.new_task_system.task_system.TaskSystem/CheckIn?rpc_data=%7B%7D'
    # 签到 https://vip.video.qq.com/rpc/trpc.new_task_system.task_system.TaskSystem/CheckIn?rpc_data={}

    url0 = 'https://vip.video.qq.com/rpc/trpc.new_task_system.task_system.TaskSystem/ReadTaskList?rpc_data=%7B%22business_id%22:%221%22,%22platform%22:3%7D'
    #  任务列表 https://vip.video.qq.com/rpc/trpc.new_task_system.task_system.TaskSystem/ReadTaskList?rpc_data={"business_id": "1", "platform": 3}

    url2 = 'https://vip.video.qq.com/rpc/trpc.query_vipinfo.vipinfo.QueryVipInfo/GetVipUserInfoH5'  # 查看会员等级
    body2 = '{"geticon":1,"viptype":"svip","platform":7}'
        
    headers = {
        'User-Agent': ua,
        'Referer': 'https://film.video.qq.com/x/vip-center/?aid=V0%24%241%3A0%242%3A7%243%3A8.7.30.25756%244%3A3%248%3A4%2412%3A&hidetitlebar=1&isDarkMode=0&uiType=REGULAR',
        'Origin': 'https://film.video.qq.com',
        'Host': 'vip.video.qq.com',
        'Cookie': ck,
        'Connection': 'keep-alive',
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'application/json, text/plain, */*'
    }
    try:
        resp = requests.get(url, headers=headers)
        if resp.status_code == 200:
            resp = resp.json()
            print(f"账号:{name}签到{resp}")
            msg.append('------------- 任务状态 -------------')
            msg.append(f'开始执行账号:{name}')
            if resp['ret'] == 0:
                pass
                # msg.append(f"VIP会员每日签到:(已签到，获得{resp['check_in_score']}点V力值)")
            elif resp['ret'] == -2002:
                # print(f"签到失败:今日已签到")
                pass
                # msg.append(f"签到失败:今日已签到")
            else:
                msg.append(f"签到异常:{resp}")
        else:
            print(f'账号:{name} 服务器响应错误:{resp.status_code}')
            msg.append(f"账号:{name} CK已失效")
    except Exception as e:
        print(f'{name} 签到报错{e}')

    try:
        resp0 = requests.get(url0, headers=headers)
        if resp0.status_code == 200:
            resp0 = resp0.json()
            # print(resp0)

            for a in range(len(resp0['task_list'])):
                # print(resp2['task_list'][a])
                task_maintitle = resp0['task_list'][a]['task_maintitle']  # 任务标题 (比如VIP会员每日签到)
                task_subtitle = resp0['task_list'][a]['task_subtitle']  # 完成任务v力值(比如已签到，获得5点V力值)
                task_button_desc = resp0['task_list'][a]['task_button_desc']  # 任务完成/未完成(比如领取 去完成 已领取)
                task_type = resp0['task_list'][a]['task_type']  # 常用任务(签到,绑定手机号，赠送福袋，看视频60min)
                task_correlation_id = resp0['task_list'][a]['task_correlation_id']  # 任务id(看视频是1，福袋是12)

                if task_type == '1':
                    if '已完成' in task_button_desc:
                        msg.append(f"{task_maintitle}({task_subtitle})")
                        # print(f"{task_maintitle}({task_subtitle})")

                    elif '去完成' in task_button_desc:
                        try:
                            url1 = f'https://vip.video.qq.com/rpc/trpc.new_task_system.task_system.TaskSystem/ProvideAward?rpc_data=%7B%22task_id%22:{task_correlation_id}%7D'
                            resp1 = requests.get(url1, headers=headers)
                            if resp1.status_code == 200:
                                resp1 = resp1.json()
                                print(f"账号:{name} {task_maintitle}:{resp1}")
                                if resp1['ret'] == 0:
                                    # print(f"{task_maintitle}(已完成获得{resp1['provide_value']}V力值)")
                                    msg.append(f"{task_maintitle}(已完成获得{resp1['provide_value']}点V力值)")
                                elif resp1['ret'] == -2003:
                                    # msg.append(f'账号:{name} 看视频60min失败:未领取或已领取')
                                    msg.append(f'{task_maintitle}-----(任务未完成)')
                                else:
                                    # print(f"{task_maintitle}:{resp1}")
                                    msg.append(f"{task_maintitle} 任务异常:{resp1}")
                            else:
                                print(f'{task_maintitle} 服务器响应错误:{resp1.status_code}')
                                # msg.append(f'账号:{name} {task_maintitle}:{resp1.status_code}')
                        except Exception as e:
                            print(f"{name} {task_maintitle}报错:{e}")
                    else:
                        # 领取
                        try:
                            url1 = f'https://vip.video.qq.com/rpc/trpc.new_task_system.task_system.TaskSystem/ProvideAward?rpc_data=%7B%22task_id%22:{task_correlation_id}%7D'
                            resp1 = requests.get(url1, headers=headers)
                            if resp1.status_code == 200:
                                resp1 = resp1.json()
                                print(f"账号:{name} {task_maintitle}:{resp1}")
                                if resp1['ret'] == 0:
                                    # print(f"{task_maintitle}(已完成获得{resp1['provide_value']}V力值)")
                                    msg.append(f"{task_maintitle}(已完成获得{resp1['provide_value']}点V力值)")
                                elif resp1['ret'] == -2003:
                                    # msg.append(f'账号:{name} 看视频60min失败:未领取或已领取')
                                    msg.append(f'{task_maintitle}-----(任务未完成)')
                                else:
                                    # print(f"{task_maintitle}:{resp1}")
                                    msg.append(f"{task_maintitle} 任务异常:{resp1}")
                            else:
                                print(f'{task_maintitle} 服务器响应错误:{resp1.status_code}')
                                # msg.append(f'账号:{name} {task_maintitle}:{resp1.status_code}')
                        except Exception as e:
                            print(f"{name} {task_maintitle}报错:{e}")
                else:
                    pass
                    # msg.append(f"{task_maintitle}{task_button_desc}")
                    #  # 其他任务标题
        else:
            # print(f'账号:{name} 服务器响应错误::{resp0.status_code}')
            msg.append(f"账号:{name} CK已失效")
    except Exception as e:
        print(f'{name} {e}')

    try:
        resp2 = requests.post(url2, data=body2, headers=headers)
        if resp2.status_code == 200:
            resp2 = resp2.json()
            # print(f"{name} {resp2}")
            # print(f"当前等级:LV{resp2['level']} V力值:{resp2['score']}\n有效期至:{resp2['endTime']}")
            if resp2['score'] >= 53600:
                hai = f'您已是星光'
            elif resp2['score'] >= 36800:
                hai = f"还差{53600-resp2['score']}可升级"
            elif resp2['score'] >= 16800:
                hai = f"还差{36800 - resp2['score']}可升级"
            else:
                hai = f'不计算'
            msg.append(f"会员等级:V{resp2['level']} V力值:{resp2['score']}({hai})\n\t\t有效期至:{resp2['endTime']}")
        else:
            print(f'服务器响应错误:{resp2.status_code}')
            msg.append(f"账号:{name} CK已失效")
    except Exception as e:
        print(f'{name} {e}')
    msg.append(f"-------- {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} --------\n")






def main():
    if len(config) > 0:
        for a in range(len(config)):
            tx(config[a]['ck'], config[a]['ua'], config[a]['name'])

        qy_push("腾讯视频签到通知", '\n'.join(msg))
    else:
        print(f'你的号{config}')


def qy_push(Content, Text):
    if push == 1:
        if not QYWX_AM:
            print("QYWX_AM 未设置!!\n取消推送")
            return
        QYWX_AM_A = QYWX_AM.split(",")
        try:
            qy_url = f'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={QYWX_AM_A[0]}&corpsecret={QYWX_AM_A[1]}'
            re_ss = requests.get(qy_url).json()
            access_token = re_ss['access_token']
        except Exception as e:
            print(f'抛出异常:{e}')
            return
        qy_url = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" + access_token
        if len(QYWX_AM_A) == 4:
            # print('文字推送')
            print(f'\n~进入推送')
            data = {
                "touser": QYWX_AM_A[2],
                "msgtype": "text",
                "agentid": QYWX_AM_A[3],
                "text": {
                    "content": f'{Content}\n{Text}\n通知时间:{datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'
                },
            }
            re1 = requests.post(url=qy_url, json=data).json()
            if re1['errcode'] == 0:
                # print('推送标题:', Content)
                print('推送内容:\n', Text)
                print('server结果:推送成功🎉！')
            else:
                print(f"推送失败!{re1}")

        elif len(QYWX_AM_A) == 5:
            # print('图片推送')
            print(f'\n~进入推送')
            data = {
                "touser": QYWX_AM_A[2],
                "msgtype": "mpnews",
                "agentid": QYWX_AM_A[3],
                "mpnews": {
                    "articles": [
                        {
                            "title": Content,
                            "thumb_media_id": QYWX_AM_A[4],
                            "author": "摸鱼助手",
                            "content_source_url": "",
                            "content": Text.replace("\n", "<br/>"),
                            # "content": Text,
                            "digest": Text,
                        }
                    ]
                },
            }
            re1 = requests.post(url=qy_url, json=data).json()
            if re1['errcode'] == 0:
                # print('推送标题:', Content)
                print('推送内容:\n', Text)
                print('server结果:推送成功🎉！')
            else:
                print(f"推送失败!{re1}")
        else:
            print("QYWX_AM 设置错误!!\n取消推送")
    else:
        print(f'你选择了不推送!push ==1 推送哦\n\n{Content}\n{Text}')


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""

GLaDOS注册地址：https://hmr8b-97ezm-qwtcb-i0mvl.glados.space/

签到页面---F12---network(网络)---checkin里面的cookie

环境变量 ：GR_COOKIE

File: checkin.py(GLaDOS签到)
Author: Hennessey
Date: 2023/3/22 18:59
cron: 40 0 * * *
new Env('GLaDOS签到');
Update: 2023/3/22 优化逻辑
"""


import requests
import json
import os
import sys
import time

# 获取青龙面板环境变量中的GlaDOS账号Cookie
def get_cookies():
    cookies = []
    if os.environ.get("GR_COOKIE"):
        print("已获取并使用Env环境 Cookie")
        if '&' in os.environ["GR_COOKIE"]:
            cookies = os.environ["GR_COOKIE"].split('&')
        elif '\n' in os.environ["GR_COOKIE"]:
            cookies = os.environ["GR_COOKIE"].split('\n')
        else:
            cookies = [os.environ["GR_COOKIE"]]
    else:
        print("未获取到正确的GlaDOS账号Cookie")
        return
    print(f"共获取到{len(cookies)}个GlaDOS账号Cookie\n")
    print(f"脚本执行时间(北京时区): {time.strftime('%Y/%m/%d %H:%M:%S', time.localtime())}\n")
    return cookies


# 加载通知服务
def load_send():
    cur_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(cur_path)
    if os.path.exists(cur_path + "/sendNotify.py"):
        try:
            from sendNotify import send
            return send
        except Exception as e:
            print(f"加载通知服务失败：{e}")
            return None
    else:
        print("加载通知服务失败")
        return None


# GlaDOS签到
def checkin(cookie):
    checkin_url= "https://glados.rocks/api/user/checkin"
    state_url= "https://glados.rocks/api/user/status"
    referer = 'https://glados.rocks/console/checkin'
    origin = "https://glados.rocks"
    useragent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36"
    payload={
        'token': 'glados.network'
    }
    try:
        checkin = requests.post(checkin_url,headers={
            'cookie': cookie ,
            'referer': referer,
            'origin':origin,
            'user-agent':useragent,
            'content-type':'application/json;charset=UTF-8'},data=json.dumps(payload))
        state =  requests.get(state_url,headers={
            'cookie': cookie ,
            'referer': referer,
            'origin':origin,
            'user-agent':useragent})
    except Exception as e:
        print(f"签到失败，请检查网络：{e}")
        return None, None, None
    
    try:
        mess = checkin.json()['message']
        mail = state.json()['data']['email']
        time = state.json()['data']['leftDays'].split('.')[0]
    except Exception as e:
        print(f"解析登录结果失败：{e}")
        return None, None, None
    
    return mess, time, mail


# 执行签到任务
def run_checkin():
    contents = []
    cookies = get_cookies()
    if not cookies:
        return ""

    for cookie in cookies:
        ret, remain, email = checkin(cookie)
        if not ret:
            continue
            
        content = f"账号：{email}\n签到结果：{ret}\n剩余天数：{remain}\n\n"
        contents.append(content)

    contents_str = "".join(contents)
    print(contents_str)
    return contents_str


if __name__ == '__main__':
    title = "GlaDOS签到通知"
    contents = run_checkin()
    send_notify = load_send()
    if send_notify:
        if contents =='':
            contents=f'信息获取失败，请检查账户信息以及青龙网络环境'
        send_notify(title, contents)
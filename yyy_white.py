#!/usr/bin/env python3
# -*- coding:utf-8 -*-
# @Author : 不愿面对

#实现功能 添加当前公网ip到优亦云白名单
#注册链接：http://www.yyyip.cn/?r=3159

import requests
import json

#获取当前白名单链接
get_white_url="http://data.yyyip.cn:8888/whiteip_api?method=list&token=6C5ED5FD9ED38548EC2756248118E083"

#删除白名单链接
del_url="http://data.yyyip.cn:8888/whiteip_api?method=del&token=6C5ED5FD9ED38548EC2756248118E083&ip="

#添加白名单链接
add_url="http://data.yyyip.cn:8888/whiteip_api?method=add&token=6C5ED5FD9ED38548EC2756248118E083&ip="


def get_ip():
    ip = requests.get('http://ip.3322.net').text.strip()
    print("当前公网IP:"+ip)
    return ip
    
    
def get_white_list_ip():
    # 获取白名单IP的url
    url = ""
    session = requests.session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }
    response = session.get(url=get_white_url, headers=headers, verify=False)
    data = json.loads(response.text)
    if not data['data']:
        print("白名单内无IP")
        return None
    else:
        white_list_ip = data['data'][0]['ip']
        print("当前白名单IP:"+ white_list_ip)
        return white_list_ip


def del_all():
    if white_ip is None:
        return
    url = del_url + white_ip
    session = requests.session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }
    response = session.get(url=url, headers=headers, verify=False)
    data = json.loads(response.text)
    msg = data['msg']
    print(msg)


def add_bmd(new_ip):
    url = add_url + new_ip
    session = requests.session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }
    response = session.get(url=url, headers=headers, verify=False)
    data = json.loads(response.text)
    msg = data['msg']
    if msg == "添加成功 1 个":
        print("添加IP："+ new_ip +"成功")
    return msg


if __name__ == '__main__':
    white_ip = get_white_list_ip()
    new_ip = get_ip()
    if white_ip != new_ip:
        print("白名单IP和新的公网IP不同，已删除并添加新IP") 
        del_all()
        add_bmd(new_ip)
    else:
        print("白名单IP和新的公网IP一致")  

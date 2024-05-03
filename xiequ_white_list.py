"""
new Env('携趣IP白名单');
0 8 * * * xiequ_white_list.py
export XIEQU_UID='xxxxxx'
export XIEQU_UKEY='xxxxxxxxxxxxxxxxx'
by:xmo
"""

import requests
import time
import re
import sys
import os

print("")

# uid&ukey从配置读取
uid = os.getenv("XIEQU_UID")
ukey = os.getenv("XIEQU_UKEY")

# uid = ""
if not uid:
    print(">>>无uid退出,请先export XIEQU_UID=你自己的uid")
    sys.exit(0)

# ukey = ""
if not ukey:
    print(">>>无ukey退出,请先export XIEQU_UKEY=你自己的ukey")
    sys.exit(0)

# 加载通知
def load_send():
    global send
    cur_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(cur_path)
    if os.path.exists(cur_path + "/sendNotify.py"):
        try:
            from sendNotify import send
        except:
            send=False
            print(">>>加载通知服务失败~")
    else:
        send=False
        print(">>>加载通知服务失败~")
load_send()

msg = ">>>开始执行……"

# 置空IP地址
ip = ""

# 尝试使用3322.org网站获取公网IP
try:
    url = "http://members.3322.org/dyndns/getip/"
    response = requests.get(url)
    ip = response.text.strip()
    print(f">>>使用3322.org获取公网IP成功：{ip}")
    msg = msg + "\n" + f">>>使用3322.org获取公网IP成功：{ip}"
except requests.RequestException as e:
    print(">>>使用3322.org获取公网IP失败，尝试其他方式...")
    msg = msg + "\n" + ">>>使用3322.org获取公网IP失败，尝试其他方式..."

#ip = ""

# 尝试使用synology.com网站获取公网IP
if not ip:
    url = "https://checkip.synology.com/"
    def get_external_ip():
        site = requests.get(url)
        grab = re.findall('([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)', site.text)
        address = grab[0]
        return address
    ip = get_external_ip()
    if not ip:
        print(">>>使用synology.com获取公网IP失败，尝试其他方式...")
        msg = msg + "\n" + ">>>使用synology.com获取公网IP失败，尝试其他方式..."
    else:
        print(f">>>使用synology.com获取公网IP成功：{ip}")
        msg = msg + "\n" + f">>>使用synology.com获取公网IP成功：{ip}"

#ip = ""

# 尝试使用httpbin.org网站获取公网IP
if not ip:
    try:
        url = "http://httpbin.org/ip"
        response = requests.get(url)
        data = response.json()
        ip = data['origin']
        print(f">>>使用httpbin.org获取公网IP成功：{ip}")
        msg = msg + "\n" + f">>>使用httpbin.org获取公网IP成功：{ip}"
    except requests.RequestException as e:
        print(">>>使用httpbin.org获取公网IP失败，请检查网络连接或其他问题。")
        msg = msg + "\n" + ">>>使用httpbin.org获取公网IP失败，请检查网络连接或其他问题。"

#ip = ""

# 判断是否获取到公网IP
if not ip:
    print(">>>未获取到公网IP，过程终止...")
    msg = msg + "\n" + ">>>未获取到公网IP，过程终止..."
else:
    # 判断当前ip是否在白名单内
    # 查询IP白名单
    get_url = f"http://op.xiequ.cn/IpWhiteList.aspx?uid={uid}&ukey={ukey}&act=get"
    response = requests.get(get_url)
    print(f">>>执行前查询白名单IP：{response.text}")
    msg = msg + "\n" + f">>>执行前查询白名单IP：{response.text}"
    if ip in response.text:
        print(">>>当前ip在白名单内，过程终止...")
        msg = msg + "\n" + ">>>当前ip在白名单内，过程终止..."
    else:
        # 删除所有已有的白名单 IP
        time.sleep(1)
        delete_url = f"http://op.xiequ.cn/IpWhiteList.aspx?uid={uid}&ukey={ukey}&act=del&ip=all"
        response = requests.get(delete_url)
        print(f">>>清空白名单IP：{response.text}")
        msg = msg + "\n" + f">>>清空白名单IP：{response.text}"
        # 添加IP到白名单
        time.sleep(1)
        add_url = f"http://op.xiequ.cn/IpWhiteList.aspx?uid={uid}&ukey={ukey}&act=add&ip={ip}"
        response = requests.get(add_url)
        print(f">>>添加白名单IP：{response.text}")
        msg = msg + "\n" + f">>>添加白名单IP：{response.text}"
        time.sleep(10)
  
# 查询IP白名单
get_url = f"http://op.xiequ.cn/IpWhiteList.aspx?uid={uid}&ukey={ukey}&act=get"
response = requests.get(get_url)
print(f">>>执行后查询白名单IP：{response.text}")
msg = msg + "\n" + f">>>执行后查询白名单IP：{response.text}"
msg = msg + "\n" + ">>>执行结束……"
send("携趣IP白名单\n\n" + msg +"\n","本通知 by xmo")


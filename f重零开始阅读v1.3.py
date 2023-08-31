'''
活动入口,微信打开：https://entry-1318684421.cos.ap-nanjing.myqcloud.com/cos_b.html?openId=oiDdr54Nefy0xxsTr6SGgdSzpWj0

打开活动入口，抓包的任意接口cookies中的authtoken参数,填到脚本最下方的,脚本最下方的，脚本最下方的mycklist中，把xxxx替换成你的authtoken参数
注意：脚本变量使用的单引号、双引号、逗号都是英文状态的
注意：脚本变量使用的单引号、双引号、逗号都是英文状态的
注意：脚本变量使用的单引号、双引号、逗号都是英文状态的

青龙添加环境变量名称 ：clksconfig
青龙添加环境变量参数
单账户 ['xxxx']
多账户['xxxx','xxxx','xxxx']
例如：['eycxxxxx']
例如：['eyJ0eXAiOiJKV1QiLCzUxMiJ9.eyJzdWIiO','eyJ0eXAiOiJKV1QiLCzUxMiJ9.eyJzdWIiO','eyJ0eXAiOiJKV1QiLCzUxMiJ9.eyJzdWIiO']
不建议一个微信号跑多账号

提现标准：3毛就提现
内置推送第三方 wxpusher(其他脚本添加过，无需重复添加)
青龙添加环境变量名称 ：pushconfig
青龙添加环境变量参数 ：{"printf":0,"appToken":"xxxx","topicIds":4781,"key":"xxxx"}
例如：{"printf":0,"appToken":"AT_r1vNXQdfgxxxxxscPyoORYg","topicIds":1234,"key":"642ae5f1xxxxx6d2334c"}

printf 0是不打印调试日志，1是打印调试日志
appToken 这个是填wxpusher的appToken
topicIds 这个是wxpusher的topicIds改成你自己的,在主题管理里能看到应用的topicIds 具体使用方法请看文档地址：https://wxpusher.zjiecode.com/docs/#/
key 访问http://175.24.153.42:8882/getkey获取


定时运行每半小时一次
达到标准自动提现

运行脚本要先安装python的pycryptodome依赖
依赖安装失败，试试先安装一下linux依赖
python3-dev
libc-dev
gcc
'''

import requests
import re
import random
import time
from urllib.parse import urlparse, parse_qs
from Crypto.Cipher import AES
import base64
import os
import json
checkDict={
'Mzg4MDU1MTc0NA==':['二年级语文人教版电子课本网','gh_1b0bd09dadde'],
'MzU5MDc0NjU4Mg==':['数字经济联合会','gh_a0faa4832d9d'],
'MzA3Njk1NzAyNA==':['兰州烈士陵园','gh_24f4b108ae7b'],
'MzI2ODcwOTQzMg==':['物联网智慧消费','gh_785c2867f90e'],
'MzU5ODU0MzM4Mg==':['幸福沙河','gh_7c6bf42661b4'],
'Mzg2OTcwOTQzNQ==':['懂你的小世界文案馆','gh_b3d79cd1e1b5'],
'MzI0NTgyOTYxOQ==':['民族学与人类学Anthropology','gh_b3d79cd1e1b5'],
'MzI3MTY2OTYyNA==':['江西环境','gh_b3d79cd1e1b5'],
'MjM5NTY1OTI0MQ==':['商务印书馆','gh_b3d79cd1e1b5'],
'MzU3ODEyNTgyNQ==':['规划师笔记','gh_b3d79cd1e1b5'],
'MzkyNDIxMzE4OA==':['科学演绎法','gh_b3d79cd1e1b5'],
'MzI1NjY4Njc0Mw==':['政在解读','gh_b3d79cd1e1b5'],
'MzU4OTg3Njg1Nw==':['小练笔记','gh_b3d79cd1e1b5'],
}
def getmsg():
    lvsion = 'v1.3'
    r=''
    try:
        u='http://175.24.153.42:8881/getmsg'
        p={'type':'clks'}
        r=requests.get(u,params=p)
        rj=r.json()
        version=rj.get('version')
        gdict = rj.get('gdict')
        gmmsg = rj.get('gmmsg')
        print('系统公告:',gmmsg)
        print(f'最新版本{version},当前版本{lvsion}')
        s=len(gdict)
        l=len(checkDict.values())
        print(f'系统的公众号字典{len(gdict)}个:{gdict}')
        print(f'本脚本公众号字典{len(checkDict.values())}个:{list(checkDict.keys())}')
        if s>l:
            print(f'新增了{s-l}个过检测字典，快手动去脚本的checkDict里添加吧')
        print('='*50)
    except Exception as e:
        print(r.text)
        print(e)
        print('公告服务器异常')
def printjson(text):
    if printf==0:
        return
    print(text)
def push(title,link,text,type):
    str1='''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>TITLE</title>
<style type=text/css>
   body {
   	background-image: linear-gradient(120deg, #fdfbfb 0%, #a5d0e5 100%);
    background-size: 300%;
    animation: bgAnimation 6s linear infinite;
}
@keyframes bgAnimation {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
}
</style>
</head>
<body>
<p>TEXT</p><br>
<p><a href="http://175.24.153.42:8882/lookstatus?key=KEY&type=TYPE">查看状态</a></p><br>
<p><a href="http://175.24.153.42:8882/lookwxarticle?key=KEY&type=TYPE&wxurl=LINK">点击阅读检测文章</a></p><br>
</body>
</html>
    '''
    content=str1.replace('TITTLE',title).replace('LINK',link).replace('TEXT',text).replace('TYPE',type).replace('KEY',key)
    datapust = {
      "appToken":appToken,
      "content":content,
      "summary":title,
      "contentType":2,
      "topicIds":[topicIds],
    }
    urlpust = 'http://wxpusher.zjiecode.com/api/send/message'
    try:
        p = requests.post(url=urlpust, json=datapust).text
        printjson(p)
        print('推送成功')
        return True
    except:
        print('推送失败！')
        return False

def getinfo(link):
    try:
        r=requests.get(link)
        #printjson(r.text)
        html = re.sub('\s', '', r.text)
        biz=re.findall('varbiz="(.*?)"\|\|', html)
        if biz!=[]:
            biz=biz[0]
        if biz=='' or biz==[]:
            if '__biz' in link:
                biz = re.findall('__biz=(.*?)&', link)
                if biz != []:
                    biz = biz[0]
        nickname = re.findall('varnickname=htmlDecode\("(.*?)"\);', html)
        if nickname!=[]:
            nickname=nickname[0]
        user_name = re.findall('varuser_name="(.*?)";', html)
        if user_name!=[]:
            user_name=user_name[0]
        msg_title = re.findall("varmsg_title='(.*?)'\.html\(", html)
        if msg_title!=[]:
            msg_title=msg_title[0]
        text=f'公众号唯一标识：{biz}|文章:{msg_title}|作者:{nickname}|账号:{user_name}'
        print(text)
        return nickname,user_name,msg_title,text,biz
    except Exception as e:
        print(e)
        print('异常')
        return False
def setstatus():
    u='http://175.24.153.42:8882/setstatus'
    p={'key':key,'type':'clks','val':'1'}
    r=requests.get(u,params=p)
    print(r.text)

def getstatus():
    u = 'http://175.24.153.42:8882/getstatus'
    p = {'key':key,'type':'clks'}
    r = requests.get(u, params=p)
    return r.text
def aes_encrypt(text):
    bs = AES.block_size
    pad = lambda s: s + (bs - len(s) % bs) * chr(bs - len(s) % bs)
    cipher = AES.new(b'5e4332761103722eb20bb1ad53907c6e', AES.MODE_ECB)
    data = cipher.encrypt(pad(text).encode())
    t = str(base64.b64encode(data), encoding='utf-8')
    return t

class WXYD:
    def __init__(self, cg):
        self.homeHost = self.get_readHome()
        self.headers = {
            'Host': self.homeHost,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090621) XWEB/8351 Flue',
            'token': '',
            'Accept': '*/*',
            'Referer': f'http://{self.homeHost}/app/main?openId=oiDdr54Nefy0xxsTr6SGgdSzpWj0',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh',
            'Cookie': f'authtoken={cg["authtoken"]}; snapshot=0',
        }
        self.f=0

    def get_readHome(self):
        h = {
            'Host': 'sss.mvvv.fun',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090621) XWEB/8351 Flue',
            'Origin': 'https://entry-1318684421.cos.ap-nanjing.myqcloud.com',
            'Referer': 'https://entry-1318684421.cos.ap-nanjing.myqcloud.com/',
        }
        u = 'https://sss.mvvv.fun/app/enter/read_home'
        r = requests.get(u, headers=h)
        printjson(r.text)
        rj = r.json()
        if rj.get('code') == 0:
            homeurl = rj['data']['location']
            hosturl = re.findall('//(.*?)/', homeurl)[0]
            print('get home url is', homeurl)
            print('-' * 50)
            return hosturl
        else:
            print('get home page err')
            return "http://5x034gb8z4.qqaas.fun"

    def myPickInfo(self):
        print('-'*30)
        u = f'http://{self.homeHost}/app/user/myPickInfo'
        r = requests.get(u, headers=self.headers)
        rj = r.json()
        printjson(r.text)
        data = rj.get('data')
        goldNow=data.get('goldNow')
        if goldNow >0:
            txu='http://mhxbn1se67.qqaas.fun/app/user/pickAuto'
            p='{"moneyPick":goldNow}'.replace('goldNow',str(goldNow))
            payload=aes_encrypt(p)
            self.headers.update({'Content-Type': 'application/json'})
            r = requests.post(txu, headers=self.headers,json=payload)
            print('提现结果',r.text)
        else:
            print('没有达到提现标准')

    def myInfo(self):
        try:
            u = f'http://{self.homeHost}/app/user/myInfo'
            r = requests.get(u, headers=self.headers)
            rj = r.json()
            printjson(r.text)
            data = rj.get('data')
            msg = rj.get('success')
            nameNick = data.get('nameNick')
            self.goldNow = data.get('goldNow')
            completeTodayCount = data.get('completeTodayCount')
            completeTodayGold = data.get('completeTodayGold')
            readable = data.get('readable')
            remainSec = data.get('remainSec')
            print(
                f'当前用户{nameNick}，当前积分:{self.goldNow}，今日已读{completeTodayCount}篇文章，获得了{completeTodayGold}积分，用户状态:{readable},提示信息:{msg}。')
            if readable ==False:
                print('你现在是黑号状态')
                print('尝试获取一篇文章')
            if remainSec == 0:
                print('当前是读文章的状态')
            else:
                ms = int(remainSec / 60)
                print('当前不是是读文章的状态,距离下次阅读还有', ms,'分钟')
                return False
            print('-' * 50)
            return True
        except Exception as e:
            print(e)
            print(r.text)
            print('账号异常ck可能失效')
            return False

    def getkey(self):
        u = f'http://{self.homeHost}/app/read/get'
        r = requests.get(u, headers=self.headers)
        rj = r.json()
        print('getkey',r.text)
        location = rj.get('data').get('location')
        p = parse_qs(urlparse(location).query)
        hn = urlparse(location).netloc
        uk = p.get('u')[0]
        print('get key is ', uk)
        print('-' * 50,'\n','第一次请求一定是None，获取key和阅读文章')

        h = {
            'Host': 'sss.mvvv.fun',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090621) XWEB/8351 Flue',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': '*/*',
            'Origin': f'https://{hn}',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': f'https://{hn}/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh',
        }
        return uk,h

    def do_read(self):
        info = self.getkey()
        time.sleep(3)
        self.params={'u':info[0],'type':'1'}
        while True:
            u = f'https://sss.mvvv.fun/app/task/doRead'
            r = requests.get(u, headers=info[1],params=self.params)
            print('-'*50)
            printjson(r.text)
            rj = r.json()
            if rj.get('code') != 0:
                print('未知情况，结束阅读,code不是0')
                return False
            detail = rj.get('data').get('detail')
            bizCode = rj.get('data').get('bizCode')
            print(f'上一篇阅读结果：{detail}')
            if bizCode ==0:
                self.taskKey = rj.get('data').get('taskKey')
                self.params.update({'key':self.taskKey})
                taskUrl=rj.get('data').get('taskUrl')
                a = getinfo(taskUrl)
                if a == False:
                    push('从零开始阅读过检测', taskUrl, '文章获取失败', 'clks')
                    return False
                if self.testCheck(a, taskUrl) == False:
                    return False
                if self.f==1:
                    if self.testCheck(a, taskUrl) == False:
                        self.f=0
                        return False
                print('开始本次阅读')
                ts = random.randint(9, 11)
                print(f'本次模拟读{ts}秒')
                time.sleep(ts)
            elif bizCode==10:
                print('下批文章将在60分钟后到达')
                return False
            elif bizCode==11:
                print('当天达到上限')
                return False
            elif bizCode==20:
                print('文章正在补充中，稍后再试')
                return False
            elif bizCode==30:
                print('下批文章将在24小时后到来')
                return False
            elif bizCode==31:
                print('遇到检测，自动过检测，重新阅读')
                self.params = {'u': info[0], 'type': '1'}
                self.f=1
                time.sleep(5)
            else:
                print('未知情况，结束阅读')
                return False
    def testCheck(self,a,url):
        if a[4]==[]:
            print('这个链接没有获取到微信号id', url)
            return True
        if checkDict.get(a[4]) != None:
            setstatus()
            for i in range(61):
                if i % 30 == 0:
                    push('从零开始阅读过检测', url, a[3], 'clks')
                getstatusinfo = getstatus()
                if getstatusinfo == '0':
                    print('过检测文章已经阅读')
                    return True
                elif getstatusinfo == '1':
                    print(f'正在等待过检测文章阅读结果{i}秒。。。')
                    time.sleep(1)
                else:
                    print('服务器异常')
                    return False
            print('过检测超时中止脚本防止黑号')
            return False
        else:return True
    def run(self):
        if self.myInfo():
            time.sleep(5)
            self.do_read()
            time.sleep(2)
            self.myInfo()
        time.sleep(2)
        self.myPickInfo()

if __name__ == '__main__':
    print(list(checkDict.keys()))
    pushconfig = os.getenv('pushconfig')
    if pushconfig == None:
        print('请检查你的推送变量名称是否填写正确')
        exit(0)
    try:
        pushconfig = json.loads(pushconfig.replace("'", '"'))
    except Exception as e:
        print(e)
        print(pushconfig)
        print('请检查你的推送变量参数是否填写正确')
        exit(0)
    clksconfig = os.getenv('clksconfig')
    if clksconfig == None:
        print('请检查你的从零开始阅读脚本变量名称是否填写正确')
        exit(0)
    try:
        clksconfig = json.loads(clksconfig.replace("'", '"'))
    except Exception as e:
        print(e)
        print(clksconfig)
        print('请检查你的从零开始阅读脚本变量参数是否填写正确')
        exit(0)
    printf = pushconfig['printf']
    appToken = pushconfig['appToken']
    topicIds = pushconfig['topicIds']
    key = pushconfig['key']
    getmsg()
    for i in clksconfig:
        api = WXYD({'authtoken': i})
        api.run()
        time.sleep(5)

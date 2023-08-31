'''
活动入口,微信打开：https://wib.quannengjiaoyu.top:10265/yunonline/v1/auth/693f35a37d8da489478562a1feab678f?codeurl=wib.quannengjiaoyu.top:10265&codeuserid=2&time=1693118713
打开活动入口，抓包的任意接口cookies中的ysm_uid参数,

注意：脚本变量使用的单引号、双引号、逗号都是英文状态的
注意：脚本变量使用的单引号、双引号、逗号都是英文状态的
注意：脚本变量使用的单引号、双引号、逗号都是英文状态的

青龙添加环境变量名称 ：xyyconfig
青龙添加环境变量参数
单账户 ['xxxx']
多账户['xxxx','xxxx','xxxx']
例如：['729ac1356xxxxb7407bd2ea']
例如：['123456','djvnffff','xxxxx']



提现标准默认是10000，与需要修改，请在本脚本最下方，按照提示修改
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
达到标准，自动提现
'''

import time
import requests
import random
import re
import os
import json
from urllib.parse import urlparse, parse_qs
#公众号字典
checkDict={
'MzkxNTE3MzQ4MQ==':['香姐爱旅行','gh_54a65dc60039'],
'Mzg5MjM0MDEwNw==':['我本非凡','gh_46b076903473'],
'MzUzODY4NzE2OQ==':['多肉葡萄2020','gh_b3d79cd1e1b5'],
'MzkyMjE3MzYxMg==':['Youhful','gh_b3d79cd1e1b5'],
'MzkxNjMwNDIzOA==':['少年没有乌托邦3','gh_b3d79cd1e1b5'],
'Mzg3NzUxMjc5Mg==':['星星诺言','gh_b3d79cd1e1b5'],
'Mzg4NTcwODE1NA==':['斑马还没睡123','gh_b3d79cd1e1b5'],
'Mzk0ODIxODE4OQ==':['持家妙招宝典','gh_b3d79cd1e1b5'],
'Mzg2NjUyMjI1NA==':['Lilinng','gh_b3d79cd1e1b5'],
'MzIzMDczODg4Mw==':['有故事的同学Y','gh_b3d79cd1e1b5'],
'Mzg5ODUyMzYzMQ==':['789也不行','gh_b3d79cd1e1b5'],
'MzU0NzI5Mjc4OQ==':['皮蛋瘦肉猪','gh_58d7ee593b86'],
'Mzg5MDgxODAzMg==':['北北小助手','gh_58d7ee593b86'],
}
def getmsg():
    lvsion = 'v1.2'
    r=''
    try:
        u='http://175.24.153.42:8881/getmsg'
        p={'type':'xyyyd'}
        r=requests.get(u,params=p)
        rj=r.json()
        version=rj.get('version')
        gdict = rj.get('gdict')
        gmmsg = rj.get('gmmsg')
        print('系统公告:',gmmsg)
        print(f'最新版本{version},当前版本{lvsion}')
        print(f'系统的公众号字典{len(gdict)}个:{gdict}')
        print(f'本脚本公众号字典{len(checkDict.values())}个:{list(checkDict.keys())}')
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
        print(p)
        return True
    except:
        print('推送失败！')
        return False
def getinfo(link):
    try:
        r=requests.get(link)
        #print(r.text)
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
def ts():
    return str(int(time.time()))+'000'

def setstatus():
    u='http://175.24.153.42:8882/setstatus'
    p={'key':key,'type':'xyyyd','val':'1'}
    r=requests.get(u,params=p)
    print(r.text)

def getstatus():
    u = 'http://175.24.153.42:8882/getstatus'
    p = {'key':key,'type': 'xyyyd'}
    r = requests.get(u, params=p)
    return r.text
class HHYD():
    def __init__(self,cg):
        self.ysm_uid=cg["ysm_uid"]
        self.txbz=cg["txbz"]
        self.headers={
            'Host': '1692416143.3z2rpa.top',
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090621) XWEB/8351 Flue',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'http://1692416143.3z2rpa.top/',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': f'ysm_uid={self.ysm_uid};',
        }
        self.sec=requests.session()
        self.sec.headers=self.headers
        self.lastbiz=''
    def init(self):
        try:
            r=self.sec.get('http://1692416143.3z2rpa.top/')
            htmltext=r.text
            res1 = re.sub('\s', '', htmltext)
            signidl = re.findall('\)\|\|"(.*?)";', res1)
            if signidl==[]:
                print('初始化失败,账号异常')
                return False
            else:
                self.signid=signidl[0]
            return True
        except:
            print('初始化失败,请检查你的ck')
            return False
    def user_info(self):
        u=f'http://1692416143.3z2rpa.top/yunonline/v1/sign_info?time={ts()}000&unionid={self.ysm_uid}'
        r=''
        try:
            r=self.sec.get(u)
            rj=r.json()
            if rj.get('errcode')==0:
                printjson(r.json())
                return True
            else:
                print(f'获取用户信息失败，账号异常，请查看你的账号是否正常')
                return False
        except:
            print(r.text)
            print(f'获取用户信息失败,gfsessionid无效，请检测gfsessionid是否正确')
            return False
    def hasWechat(self):
        r=''
        try:
            u=f'http://1692416143.3z2rpa.top/yunonline/v1/hasWechat?unionid={self.ysm_uid}'
            r=self.sec.get(u)
            printjson(r.json())
        except:
            print(r.text)
            return False
    def gold(self):
        r=''
        try:
            u=f'http://1692416143.3z2rpa.top/yunonline/v1/gold?unionid={self.ysm_uid}&time={ts()}000'
            r=self.sec.get(u)
            printjson(r.json())
            rj = r.json()
            self.remain=rj.get("data").get("last_gold")
            print(f'今日已经阅读了{rj.get("data").get("day_read")}篇文章,剩余{rj.get("data").get("remain_read")}未阅读，今日获取金币{rj.get("data").get("day_gold")}，剩余{self.remain}')
        except:
            print(r.text)
            return False
    def getKey(self):
        u='http://1692416143.3z2rpa.top/yunonline/v1/wtmpdomain'
        p=f'unionid={self.ysm_uid}'
        r=requests.post(u,headers=self.headers,data=p)
        printjson(r.text)
        rj=r.json()
        domain=rj.get('data').get('domain')
        pp = parse_qs(urlparse(domain).query)
        hn = urlparse(domain).netloc
        uk = pp.get('uk')[0]
        printjson(f'get ydkey is {uk}')
        h = {
            'Host': 'nsr.zsf2023e458.cloud',
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090621) XWEB/8351 Flue',
            'Origin': f'https://{hn}',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh',
        }
        return uk, h
    def read(self):
        info = self.getKey()
        time.sleep(3)
        self.params = {'uk': info[0]}
        while True:
            u = f'https://nsr.zsf2023e458.cloud/yunonline/v1/do_read'
            r = requests.get(u, headers=info[1], params=self.params)
            print('-' * 50)
            printjson(r.json())
            rj = r.json()
            if rj.get('errcode') == 0:
                link=rj.get('data').get('link')
                wxlink=self.jump(link)
                a = getinfo(wxlink)
                if a==False:
                    push('小阅阅阅读过检测', wxlink, '文章获取失败', 'xyyyd')
                    return False
                if self.testCheck(a, wxlink) == False:
                    return False
                printjson(f'this:{a[4]}|last:{self.lastbiz}')
                if a[4]==self.lastbiz:
                    if self.testCheck(a, wxlink) == False:
                        return False
                self.lastbiz = a[4]
                tsm = random.randint(7, 10)
                print(f'本次模拟读{tsm}秒')
                time.sleep(tsm)
                u1 = f'https://nsr.zsf2023e458.cloud/yunonline/v1/get_read_gold?uk={info[0]}&time={tsm}&timestamp={ts()}'
                r1 = requests.get(u1, headers=info[1])
                printjson(r1.text)
            elif rj.get('errcode') == 405:
                print('阅读重复')
                time.sleep(1.5)
            elif rj.get('errcode') == 407:
                print('阅读结束')
                return True
            else:
                print('未知情况')
                time.sleep(1.5)
    def testCheck(self,a,url):
        if a[4] == []:
            print('这个链接没有获取到微信号id', url)
            return True
        if checkDict.get(a[4]) != None:
            setstatus()
            for i in range(60):
                if i % 30 == 0:
                    push('小阅阅阅读过检测', url, a[3], 'xyyyd')
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
    def jump(self,link):
        print('开始本次阅读')
        hn = urlparse(link).netloc
        h={
            'Host': hn,
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090621) XWEB/8351 Flue',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh',
            'Cookie': f'ysm_uid={self.ysm_uid}',
        }
        r = requests.get(link, headers=h,allow_redirects=False)
        printjson(r.status_code)
        Location=r.headers.get('Location')
        printjson(Location)
        return Location
    def withdraw(self):
        if int(self.remain)<self.txbz:
            print('没有达到提现标准')
            return False
        gold=int(int(self.remain)/1000)*1000
        print('本次提现金币',gold)
        if gold:
            u1='http://1692429080.3z2rpa.top/yunonline/v1/user_gold'
            p1=f'unionid={self.ysm_uid}&request_id={self.signid}&gold={gold}'
            r=self.sec.post(u1,data=p1)
            print(r.json())
            u=f'http://1692422733.3z2rpa.top/yunonline/v1/withdraw'
            p=f'unionid={self.ysm_uid}&signid={self.signid}&ua=0&ptype=0&paccount=&pname='
            r=self.sec.post(u,headers=self.headers,data=p)
            print('提现结果',r.json())
    def run(self):
        if self.init():
            self.user_info()
            self.hasWechat()
            self.gold()
            self.read()
            time.sleep(3)
            self.gold()
            time.sleep(3)
            self.withdraw()
if __name__ == '__main__':
    pushconfig = os.getenv('pushconfig')
    print(pushconfig)
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
    xyyconfig = os.getenv('xyyconfig')
    if xyyconfig == None:
        print('请检查你的小阅阅阅读脚本变量名称是否填写正确')
        exit(0)
    try:
        xyyconfig = json.loads(xyyconfig.replace("'", '"'))
    except Exception as e:
        print(e)
        print(xyyconfig)
        print('请检查你的美添赚脚本变量参数是否填写正确')
        exit(0)
    printf = pushconfig['printf']
    appToken = pushconfig['appToken']
    topicIds = pushconfig['topicIds']
    key = pushconfig['key']
    getmsg()
    for i in xyyconfig:
        api=HHYD({'ysm_uid':i,'txbz':10000})#这里的10000是默认提现标准，代表满10000提现，你也可以改成其他的例如3000
        api.run()
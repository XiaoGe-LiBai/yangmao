'''
活动入口,微信打开：http://2478987.epghgkvalp.wjbk.25obcxyume.cloud/?p=2478987
打开活动入口，抓包的任意接口cookies中的gfsessionid参数,

注意：脚本变量使用的单引号、双引号、逗号都是英文状态的
注意：脚本变量使用的单引号、双引号、逗号都是英文状态的
注意：脚本变量使用的单引号、双引号、逗号都是英文状态的

青龙添加环境变量名称 ：czgmconfig
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

定时运行每小时一次
达到标准自动提现
'''
import time
import hashlib
import requests
import random
import re
import json
import os
checkDict = {
    'MzkyMzI5NjgxMA==': ['每天趣闻事', ''],
    'MzkzMzI5NjQ3MA==': ['欢闹青春', ''],
    'Mzg5NTU4MzEyNQ==': ['推粉宝助手', ''],
    'Mzg3NzY5Nzg0NQ==': ['新鲜事呦', ''],
    'MzU5OTgxNjg1Mg==': ['动感比特', ''],
    'Mzg4OTY5Njg4Mw==': ['邻居趣事闻', 'gh_60ba451e6ad7'],
    'MzI1ODcwNTgzNA==': ['麻辣资讯', 'gh_1df5b5259cba'],
}
def getmsg():
    lvsion = 'v1.2'
    r=''
    try:
        u='http://175.24.153.42:8881/getmsg'
        p={'type':'czgm'}
        r=requests.get(u,params=p)
        rj=r.json()
        version=rj.get('version')
        gdict = rj.get('gdict')
        gmmsg = rj.get('gmmsg')
        print('系统公告:',gmmsg)
        print(f'最新版本{version}当前版本{lvsion}')
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
def sha_256(text):
    hash = hashlib.sha256()
    hash.update(text.encode())
    t = hash.hexdigest()
    return t

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
def setstatus():
    u='http://175.24.153.42:8882/setstatus'
    p={'key':key,'type':'czgm','val':'1'}
    r=requests.get(u,params=p)
    print(r.text)

def getstatus():
    u = 'http://175.24.153.42:8882/getstatus'
    p = {'key':key,'type': 'czgm'}
    r = requests.get(u, params=p)
    return r.text

class HHYD():
    def __init__(self, cg):
        self.headers = {
            'Host': '2478987.jilixczlz.ix47965in5.cloud',
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090621) XWEB/8351 Flue',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh',
            'Cookie': f'gfsessionid={cg["gfsessionid"]}',
        }
        self.sec = requests.session()
        self.sec.headers = self.headers

    def user_info(self):
        ts = int(time.time())
        text = f'key=4fck9x4dqa6linkman3ho9b1quarto49x0yp706qi5185o&time={ts}'
        sign = sha_256(text)
        u = f'http://2478987.jilixczlz.ix47965in5.cloud/user/info?time={ts}&sign={sign}'
        r = ''
        try:
            r = self.sec.get(u)
            rj = r.json()
            if rj.get('code') == 0:
                print(f'用户UID:{rj.get("data").get("uid")}')
                return True
            else:
                print(f'获取用户信息失败，账号异常')
                return False
        except:
            print(r.text)
            print(f'获取用户信息失败,gfsessionid无效，请检测gfsessionid是否正确')
            return False

    def msg(self):
        r = ''
        try:
            ts = int(time.time())
            text = f'key=4fck9x4dqa6linkman3ho9b1quarto49x0yp706qi5185o&time={ts}'
            sign = sha_256(text)
            u = f'http://2478987.jilixczlz.ix47965in5.cloud/user/msg?time={ts}&sign={sign}'
            r = self.sec.get(u)
            rj = r.json()
            print(f'系统公告:{rj.get("data").get("msg")}')
        except:
            print(r.text)
            return False

    def read_info(self):
        r = ''
        try:
            ts = int(time.time())
            text = f'key=4fck9x4dqa6linkman3ho9b1quarto49x0yp706qi5185o&time={ts}'
            sign = sha_256(text)
            u = f'http://2478987.jilixczlz.ix47965in5.cloud/read/info?time={ts}&sign={sign}'
            r = self.sec.get(u)
            rj = r.json()
            self.remain = rj.get("data").get("remain")
            print(f'今日已经阅读了{rj.get("data").get("read")}篇文章，今日总金币{rj.get("data").get("gold")}，剩余{self.remain}')
        except:
            print(r.text)
            return False

    def read(self):
        print('阅读开始')
        while True:
            print('-' * 50)
            ts = int(time.time())
            text = f'key=4fck9x4dqa6linkman3ho9b1quarto49x0yp706qi5185o&time={ts}'
            sign = sha_256(text)
            u = f'http://2478987.jilixczlz.ix47965in5.cloud/read/task?time={ts}&sign={sign}'
            r = self.sec.get(u)
            printjson(r.text)
            rj = r.json()
            code = rj.get('code')
            if code == 0:
                uncode_link = rj.get('data').get('link')
                print('获取到阅读链接成功')
                link = uncode_link.encode().decode()
                a = getinfo(link)
                if self.testCheck(a, link) == False:
                    return False
                sleeptime = random.randint(7, 10)
                print('本次模拟阅读', sleeptime, '秒')
                time.sleep(sleeptime)
            elif code == 400:
                print('未知情况400')
                time.sleep(10)
                continue
            elif code == 20001:
                print('未知情况20001')
            else:
                print(rj.get('message'))
                return False
            # -----------------------------
            self.msg()
            ts = int(time.time())
            finish_headers = self.sec.headers.copy()
            finish_headers.update({'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                                   'Origin': 'http://2478987.jilixczlz.ix47965in5.cloud'})
            text = f'key=4fck9x4dqa6linkman3ho9b1quarto49x0yp706qi5185o&time={ts}'
            sign = sha_256(text)
            p = f'time={ts}&sign={sign}'
            u = f'http://2478987.jilixczlz.ix47965in5.cloud/read/finish'
            r = requests.post(u, headers=finish_headers, data=p)
            printjson(r.text)
            rj = r.json()
            if rj.get('code') == 0:
                if rj.get('data').get('check') == False:
                    gain = rj.get('data').get('gain')
                    self.remain = rj.get("data").get("remain")
                    print(f"阅读文章成功获得{gain}金币")
                    print(
                        f'当前已经阅读了{rj.get("data").get("read")}篇文章，今日总金币{rj.get("data").get("gold")}，剩余{self.remain}')
                else:
                    print("过检测成功")
                    print(f'当前已经阅读了{rj.get("data").get("read")}篇文章，今日总金币{rj.get("data").get("gold")}，剩余{self.remain}')
            else:
                return False
            time.sleep(1)
            print('开始本次阅读')

    def testCheck(self, a, link):
        if checkDict.get(a[4]) != None:
            setstatus()
            for i in range(60):
                if i % 30 == 0:
                    push('充值购买过检测', link, a[3], 'czgm')
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
        else:
            return True

    def withdraw(self):
        if self.remain < 10000:
            print('没有达到提前标准')
            return False
        ts = int(time.time())
        text = f'key=4fck9x4dqa6linkman3ho9b1quarto49x0yp706qi5185o&time={ts}'
        sign = sha_256(text)
        u = f'http://2478987.84.8agakd6cqn.cloud/withdraw/wechat?time={ts}&sign={sign}'
        r = self.sec.get(u, headers=self.headers)
        print('提现结果', r.text)

    def run(self):
        self.user_info()
        self.msg()
        self.read_info()
        self.read()
        time.sleep(5)
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
    czgmconfig = os.getenv('czgmconfig')
    if czgmconfig == None:
        print('请检查你的充值购买脚本变量名称是否填写正确')
        exit(0)
    try:
        czgmconfig = json.loads(czgmconfig.replace("'", '"'))
    except Exception as e:
        print(e)
        print(czgmconfig)
        print('请检查你的充值购买脚本变量参数是否填写正确')
        exit(0)
    printf = pushconfig['printf']
    appToken = pushconfig['appToken']
    topicIds = pushconfig['topicIds']
    key = pushconfig['key']
    getmsg()
    for i in czgmconfig:
        api = HHYD({'gfsessionid': i})
        api.run()

'''
星空阅读阅读：http://mr1692169663544.uznmvev.cn/ox/index.html?mid=XG7QUVEEH
花花阅读：http://mr1692501126125.fgrtlkg.cn/user/index.html?mid=QS5PQAEZH
元宝阅读http://mr1692766622670.kgtpecv.cn/coin/index.html?mid=RG5RC7LDU

http://u.cocozx.cn/api/user/info
抓包 info接口的请求体中的un和token参数

注意：脚本变量使用的单引号、双引号、逗号都是英文状态的
注意：脚本变量使用的单引号、双引号、逗号都是英文状态的
注意：脚本变量使用的单引号、双引号、逗号都是英文状态的

青龙添加环境变量名称 ：ybxkhhconfig
青龙添加环境变量参数
单账户 [{"un": "xxxx", "token": "xxxxx"}]
多账户[{"un": "xxxx", "token": "xxxxx"},{"un": "xxxx", "token": "xxxxx"},{"un": "xxxx", "token": "xxxxx"}]
例如：[{"un": "1234568", "token": "12345689"}]
例如：[{"un": "1234568", "token": "12345689"},{"un": "1234568", "token": "12345689"}]

提现标准默认是10000
内置推送第三方 wxpusher(其他脚本添加过，无需重复添加)
青龙添加环境变量名称 ：pushconfig
青龙添加环境变量参数 ：{"printf":0,"appToken":"xxxx","topicIds":4781,"key":"xxxx"}
例如：{"printf":0,"appToken":"AT_r1vNXQdfgxxxxxscPyoORYg","topicIds":1234,"key":"642ae5f1xxxxx6d2334c"}

printf 0是不打印调试日志，1是打印调试日志
appToken 这个是填wxpusher的appToken
topicIds 这个是wxpusher的topicIds改成你自己的,在主题管理里能看到应用的topicIds 具体使用方法请看文档地址：https://wxpusher.zjiecode.com/docs/#/
key 访问http://175.24.153.42:8882/getkey获取

定时运行每15分钟一次

默认每个时间段跑一个，若要修改，到脚本下方代码修改
#7-11点跑元宝，11到13点跑星空，14到17点跑花花
达到标准自动提现
达到标准，自动提现
'''
import requests
import time
import random
import re
import json
import os
import datetime
checkDict={
'Mzg2Mzk3Mjk5NQ==':['wz',''],
}
def getmsg():
    lvsion = 'v1.0'
    r=''
    try:
        u='http://175.24.153.42:8881/getmsg'
        p={'type':'ybxkhh'}
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
        printjson(p)
        print('推送成功')
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
def setstatus():
    u='http://175.24.153.42:8882/setstatus'
    p={'key':key,'type':'ybxkhh','val':'1'}
    r=requests.get(u,params=p)
    print(r.text)

def getstatus():
    u = 'http://175.24.153.42:8882/getstatus'
    p = {'key':key,'type': 'ybxkhh'}
    r = requests.get(u, params=p)
    return r.text
class WXYD:
    def __init__(self, cg,bz):
        self.bz=bz
        self.un = cg.get('un')
        self.token = cg.get('token')
        self.headers = {
            'Host': 'u.cocozx.cn',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090621) XWEB/8351 Flue',
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh',
        }

    def info(self):
        u = f'http://u.cocozx.cn/api/{self.bz}/info'
        p = {"code": "XG7QUVEEH", "un": self.un, "token": self.token, "pageSize": 20}
        r = requests.post(u, headers=self.headers, json=p)
        print(r.text)
        rj = r.json()
        if rj.get('code') == 0:
            resul = rj.get('result')
            self.moneyCurrent = int(resul.get('moneyCurrent'))
            dayCount = resul.get('dayCount')
            agreementStatus = resul.get('agreementStatus')
            if agreementStatus != 1:
                print('你还没有同意阅读协议，必须先手动阅读一下')
                return False
            hopeNull = resul.get('hopeNull')
            if hopeNull:
                if hopeNull.get('status') == 60:
                    print('今日文章全部读完,请明天再来')
                if hopeNull.get('status') == 70:
                    tss = hopeNull.get('ts')
                    val = hopeNull.get('val')
                    stime = datetime.datetime.strptime(tss, "%Y-%m-%d %H:%M:%S").timestamp()
                    mm = val - int((int(time.time()) - int(stime)) / 60)
                    print('下一批文章' + str(mm) + '分钟后到来')
                if hopeNull.get('status') == 50 or hopeNull.get('status') == 80:
                    print('您的阅读暂时失效，请明天再来')
                print(f'当前账号今日已经阅读{dayCount}篇文章，剩余金币{self.moneyCurrent}')
                return False
            print(f'当前账号今日已经阅读{dayCount}篇文章，剩余金币{self.moneyCurrent}')
            self.statAccess()
            print('-' * 50)
            return True
        else:
            print('可能是账号异常，ck无效，没填ck')
            print('-' * 50)
            return False

    def statAccess(self):
        u = f'http://u.cocozx.cn/api/{self.bz}/statAccess'
        p = {"un": self.un, "token": self.token, "pageSize": 20}
        r = requests.post(u, headers=self.headers, json=p)
        print(r.text)

    def agreement(self):
        u = f'http://u.cocozx.cn/api/{self.bz}/agreement'
        p = {"un": self.un, "token": self.token, "pageSize": 20}
        r = requests.post(u, headers=self.headers, json=p)
        print(r.text)

    def getReadHost(self):
        u = f'http://u.cocozx.cn/api/{self.bz}/getReadHost'
        p = {"un": self.un, "token": self.token, "pageSize": 20}
        r = requests.post(u, headers=self.headers, json=p)
        print(r.text)
        rj = r.json()
        if rj.get('code') == 0:
            host = rj.get('result').get('host')
            hostid = re.findall('mr(.*?)\.', host)[0]
            print(hostid)
            return hostid
        else:
            print('get read host err')
            return False

    def read(self):
        while True:
            print('-'*50)
            u = f'http://u.cocozx.cn/api/{self.bz}/read'
            p = {"un": self.un, "token": self.token, "pageSize": 20}
            r = requests.post(u, headers=self.headers, json=p)
            print(r.text)
            rj = r.json()
            if rj.get('code') == 0:
                status = rj.get('result').get('status')
                if status == 10:
                    url=rj.get('result').get('url')
                    a=getinfo(url)
                    if self.testCheck(a,url)==False:
                        return False
                    print('获取文章成功，准备阅读')
                    ts = random.randint(7, 10)
                    print(f'本次模拟读{ts}秒')
                    time.sleep(ts)
                    sub = self.submit()
                    if sub == True: return True
                    if sub == False: return False
                elif status==30:
                    print('未知情况')
                    time.sleep(2)
                    continue
                elif status==50 or status==80:
                    print('您的阅读暂时失效，请明天再来')
                    return False
                else:
                    print('本次推荐文章已全部读完')
                    return True
            else:
                print('read err')
                return False
    def testCheck(self,a,url):
        if checkDict.get(a[4]) != None:
            setstatus()
            for i in range(60):
                if i % 30 == 0:
                    push('元宝星空花花过检测', url, a[3], 'ybxkhh')
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
    def submit(self):
        u = f'http://u.cocozx.cn/api/{self.bz}/submit'
        p = {"un": self.un, "token": self.token, "pageSize": 20}
        r = requests.post(u, headers=self.headers, json=p)
        print(r.text)
        rj = r.json()
        if rj.get('code') == 0:
            result = rj.get('result')
            print(f'获得{result.get("val")}元宝')
            progress = result.get('progress')
            if progress > 0:
                print(f'本轮剩余{progress - 1}篇文章，继续阅读阅读')
            else:
                print('阅读已完成')
                print('-' * 50)
                return True
        else:
            print('异常')
            return False

    def wdmoney(self):
        if self.moneyCurrent < 10000:
            print('没有达到提现标准')
            return False
        elif 3000 <= self.moneyCurrent < 10000:
            txm = 3000
        elif 10000 <= self.moneyCurrent < 50000:
            txm = 10000
        elif 50000 <= self.moneyCurrent < 100000:
            txm = 50000
        else:
            txm = 100000
        u=f'http://u.cocozx.cn/api/{self.bz}/wdmoney'
        if self.bz == 'user':
            u=f'http://u.cocozx.cn/api/{self.bz}/wd'
        p = {"val":txm,"un": self.un, "token": self.token, "pageSize": 20}
        r = requests.post(u, headers=self.headers, json=p)
        print('提现结果',r.text)
    def run(self):
        if self.info():
            time.sleep(1)
            self.read()
        time.sleep(2)
        self.info()
        time.sleep(2)
        self.wdmoney()

if __name__ == '__main__':
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
    ybxkhhconfig = os.getenv('ybxkhhconfig')
    if ybxkhhconfig == None:
        print('请检查你的星空花花元宝脚本变量名称是否填写正确')
        exit(0)
    try:
        ybxkhhconfig = json.loads(ybxkhhconfig.replace("'", '"'))
    except Exception as e:
        print(e)
        print(ybxkhhconfig)
        print('请检查你的星空花花元宝脚本变量参数是否填写正确')
        exit(0)
    printf = pushconfig['printf']
    appToken = pushconfig['appToken']
    topicIds = pushconfig['topicIds']
    key = pushconfig['key']
    getmsg()
    #7-11点跑元宝，11到13点跑星空，14到17点跑花花
    h=datetime.datetime.now().hour
    bzl=[]
    if 7<=h<=10:
        bzl=['coin']
    elif 11<=h<=13:
        bzl = ['ox']
    elif 14<=h<=17:
        bzl = ['user']
    else:
        print('不在设置的时间段')
        exit(0)
    #去除下方这一行代码的井号，将同时跑任务，大概率同时黑号
    #bzl = ['user','ox','coin']
    for bz in bzl:
        print('='*50)
        print(bz)
        for cg in ybxkhhconfig:
            api = WXYD(cg,bz)
            api.run()
            time.sleep(5)

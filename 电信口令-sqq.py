import os
import re
import sys
import ssl
import time
import json
import httpx
import base64
import random
import certifi
import aiohttp
import asyncio
import logging
import datetime
import requests
import binascii
from http import cookiejar
from Crypto.Cipher import AES
from Crypto.Cipher import DES3
from Crypto.PublicKey import RSA
from urllib.parse import urlparse
from Crypto.Cipher import PKCS1_v1_5
from Crypto.Util.Padding import pad, unpad
from aiohttp import ClientSession, TCPConnector
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type
)
import pandas as pd
from urllib.parse  import quote 

apptoken = ""

MAX_RETRIES = 3
RATE_LIMIT = 10 

class RateLimiter:
    def __init__(self, rate_limit):
        self.rate_limit = rate_limit
        self.tokens = rate_limit
        self.updated_at = time.monotonic()

    async def acquire(self):
        while self.tokens < 1:
            self.add_new_tokens()
            await asyncio.sleep(0.1)
        self.tokens -= 1

    def add_new_tokens(self):
        now = time.monotonic()
        time_since_update = now - self.updated_at
        new_tokens = time_since_update * self.rate_limit
        if new_tokens > 1:
            self.tokens = min(self.tokens + new_tokens, self.rate_limit)
            self.updated_at = now
class AsyncSessionManager:
    def __init__(self, timeout=None):
        self.client = None
        self.timeout = timeout or httpx.Timeout(60.0, connect=30.0, read=30.0, write=30.0)

    async def __aenter__(self):
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        ssl_context.set_ciphers('DEFAULT@SECLEVEL=1')
        
        self.client = httpx.AsyncClient(
            verify=ssl_context,
            limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
            timeout=self.timeout
        )
        return self.client

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.aclose()

async def retry_request2(session, method, url, **kwargs):
    for attempt in range(MAX_RETRIES):
        try:
            response=await session.request(method, url, **kwargs)
            return await response
        except aiohttp.ClientError as e:
            if attempt == MAX_RETRIES - 1:
                raise
            await asyncio.sleep(2 ** attempt)

async def retry_request(session, method, url, **kwargs):
    for attempt in range(MAX_RETRIES):
        try:
            await asyncio.sleep(1)
            response=await session.request(method, url, **kwargs)
            return response.json() 
            
        except (aiohttp.ClientConnectionError, aiohttp.ServerTimeoutError) as e:
            print(f"请求失败，第 {attempt + 1} 次重试: {e}")
            if attempt == MAX_RETRIES - 1:
                raise 
            await asyncio.sleep(2 ** attempt)

class BlockAll(cookiejar.CookiePolicy):
    return_ok = set_ok = domain_return_ok = path_return_ok = lambda self, *args, **kwargs: False
    netscape = True
    rfc2965 = hide_cookie2 = False
    
def printn(m):  
    print(f'\n{m}')

context = ssl.create_default_context()
context.set_ciphers('DEFAULT@SECLEVEL=1') 
context.check_hostname = False  
context.verify_mode = ssl.CERT_NONE 

class DESAdapter(requests.adapters.HTTPAdapter):
    def init_poolmanager(self, *args, **kwargs):
        kwargs['ssl_context'] = context
        return super().init_poolmanager(*args, **kwargs)

requests.packages.urllib3.disable_warnings()
ss = requests.session()
ss.headers={"User-Agent":"Mozilla/5.0 (Linux; Android 13; 22081212C Build/TKQ1.220829.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.97 Mobile Safari/537.36","Referer":"https://wapact.189.cn:9001/JinDouMall/JinDouMall_independentDetails.html"}    
ss.mount('https://', DESAdapter())       
ss.cookies.set_policy(BlockAll())
runTime = 0
lock = asyncio.Lock()
event = asyncio.Event()
ready_count = 0  
diffValue = 0 
# current_time = datetime.datetime.now().strftime("%Y%m%d-%H-%M-%S")
log_filename = f'.电信等级权益日志.log'
logging.basicConfig(level=logging.CRITICAL,
                    format='%(asctime)s -- %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S',
                    filename=log_filename, 
                    filemode='a', encoding='utf-8')
logger = logging.getLogger(__name__)
ip_list = []
load_token_file = 'chinaTelecom_cache.json'

try:
    with open(load_token_file, 'r') as f:
        load_token = json.load(f)
except:
    load_token = {}
key = b'1234567`90koiuyhgtfrdews'
iv = 8 * b'\0'
public_key_b64 = '''-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBkLT15ThVgz6/NOl6s8GNPofdWzWbCkWnkaAm7O2LjkM1H7dMvzkiqdxU02jamGRHLX/ZNMCXHnPcW/sDhiFCBN18qFvy8g6VYb9QtroI09e176s+ZCtiv7hbin2cCTj99iUpnEloZm19lwHyo69u5UMiPMpq0/XKBO8lYhN/gwIDAQAB
-----END PUBLIC KEY-----'''

public_key_data = '''-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+ugG5A8cZ3FqUKDwM57GM4io6JGcStivT8UdGt67PEOihLZTw3P7371+N47PrmsCpnTRzbTgcupKtUv8ImZalYk65dU8rjC/ridwhw9ffW2LBwvkEnDkkKKRi2liWIItDftJVBiWOh17o6gfbPoNrWORcAdcbpk2L+udld5kZNwIDAQAB
-----END PUBLIC KEY-----'''

def ttt(hour,minute,second):    
    date = datetime.datetime.now()
    date_zero = datetime.datetime.now().replace(year=date.year, month=date.month, day=date.day, hour=hour, minute=int(minute),second=int(second))
    date_zero_time = int(time.mktime(date_zero.timetuple()))
    return date_zero_time
def encrypt(text):    
    cipher = DES3.new(key, DES3.MODE_CBC, iv)
    ciphertext = cipher.encrypt(pad(text.encode(), DES3.block_size))
    return ciphertext.hex()

def decrypt(text):
    ciphertext = bytes.fromhex(text)
    cipher = DES3.new(key, DES3.MODE_CBC, iv)
    plaintext = unpad(cipher.decrypt(ciphertext), DES3.block_size)
    return plaintext.decode()
    
def b64(plaintext):
    public_key = RSA.import_key(public_key_b64)
    cipher = PKCS1_v1_5.new(public_key)
    ciphertext = cipher.encrypt(plaintext.encode())
    return base64.b64encode(ciphertext).decode()
    
def encrypt_para2(plaintext):
    public_key = RSA.import_key(public_key_data)
    cipher = PKCS1_v1_5.new(public_key)
    ciphertext = cipher.encrypt(plaintext.encode())
    return ciphertext.hex()

def encrypt_para(plaintext):
    if not isinstance(plaintext, str):
        plaintext = json.dumps(plaintext)
    public_key = RSA.import_key(public_key_data)  
    cipher = PKCS1_v1_5.new(public_key)
    ciphertext = cipher.encrypt(plaintext.encode())
    return binascii.hexlify(ciphertext).decode() 

def encode_phone(text):
    encoded_chars = []
    for char in text:
        encoded_chars.append(chr(ord(char) + 2))
    return ''.join(encoded_chars)

def ophone(t):
    key = b'34d7cb0bcdf07523'
    utf8_key = key.decode('utf-8')
    utf8_t = t.encode('utf-8')
    cipher = AES.new(key, AES.MODE_ECB) 
    ciphertext = cipher.encrypt(pad(utf8_t, AES.block_size)) 
    return ciphertext.hex() 

def get_first_three(value):
    return mask_middle_four(value)
    if isinstance(value, (int, float)):
        return int(str(value)[:3])
    elif isinstance(value, str):
        return str(value)[:3]
    else:
        raise TypeError("非数字非字符串类型无法截取前三位")
def mask_middle_four(value):
    if isinstance(value, str):
        if len(value) >= 11:
            return value[:3] + "####" + value[-4:]
        else:
            raise ValueError("输入的字符串长度不足以截取中间四位")
    else:
        raise TypeError("输入类型错误，应为字符串")

def getApiTime(api_url):
    pass

def send(uid,content):
    
    r = requests.post('https://wxpusher.zjiecode.com/api/send/message',json={"appToken":apptoken,"content":content,"contentType":1,"uids":[uid]}).json()
    return r

def userLoginNormal(phone,password):
    alphabet = 'abcdef0123456789'
    uuid = [''.join(random.sample(alphabet, 8)),''.join(random.sample(alphabet, 4)),'4'+''.join(random.sample(alphabet, 3)),''.join(random.sample(alphabet, 4)),''.join(random.sample(alphabet, 12))]
    timestamp=datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    loginAuthCipherAsymmertric = 'iPhone 14 15.4.' + uuid[0] + uuid[1] + phone + timestamp + password[:6] + '0$$$0.'
    r = ss.post('https://appgologin.189.cn:9031/login/client/userLoginNormal',json={"headerInfos": {"code": "userLoginNormal", "timestamp": timestamp, "broadAccount": "", "broadToken": "", "clientType": "#9.6.1#channel50#iPhone 14 Pro Max#", "shopId": "20002", "source": "110003", "sourcePassword": "Sid98s", "token": "", "userLoginName": phone}, "content": {"attach": "test", "fieldData": {"loginType": "4", "accountType": "", "loginAuthCipherAsymmertric": b64(loginAuthCipherAsymmertric), "deviceUid": uuid[0] + uuid[1] + uuid[2], "phoneNum": encode_phone(phone), "isChinatelecom": "0", "systemVersion": "15.4.0", "authentication": password}}},verify=certifi.where()).json()
    try:
        l = r.get('responseData', {}).get('data', {}).get('loginSuccessResult')
    except AttributeError:
        print("userLoginNormal对象为空或格式不正确，无法获取登录成功结果")
        l = None  
    if l:
        load_token[phone] = l
        with open(load_token_file, 'w') as f:
            json.dump(load_token, f)
        ticket = get_ticket(phone,l['userId'],l['token']) 
        return ticket
    return False
        
async def exchangeForDay(phone, session, runTime, rid, stime,ckvalue,jsexec):
    async def delayed_conversion(delay):
        await asyncio.sleep(delay)
        await conversionRights(phone, rid,session,ckvalue,jsexec)

    tasks = [asyncio.create_task(delayed_conversion(i * stime)) for i in range(int(runTime))]
    await asyncio.gather(*tasks)
def get_ticket(phone,userId,token):
    r = ss.post('https://appgologin.189.cn:9031/map/clientXML',data='<Request><HeaderInfos><Code>getSingle</Code><Timestamp>'+datetime.datetime.now().strftime("%Y%m%d%H%M%S")+'</Timestamp><BroadAccount></BroadAccount><BroadToken></BroadToken><ClientType>#9.6.1#channel50#iPhone 14 Pro Max#</ClientType><ShopId>20002</ShopId><Source>110003</Source><SourcePassword>Sid98s</SourcePassword><Token>'+token+'</Token><UserLoginName>'+phone+'</UserLoginName></HeaderInfos><Content><Attach>test</Attach><FieldData><TargetId>'+encrypt(userId)+'</TargetId><Url>4a6862274835b451</Url></FieldData></Content></Request>',headers={'user-agent': 'CtClient;10.4.1;Android;13;22081212C;NTQzNzgx!#!MTgwNTg1'},verify=certifi.where())
    tk = re.findall('<Ticket>(.*?)</Ticket>',r.text)
    if len(tk) == 0:        
        return False
    return decrypt(tk[0])

async def exchange2(session, phone, title, aid, jsexec):
    printn(f"{str(datetime.datetime.now())[11:23]} {get_first_three(phone)}")
    await asyncio.sleep(5)  #测试网络延迟，弃用
    return printn(f"{str(datetime.datetime.now())[11:23]} {get_first_three(phone)}")



async def getConversionRights(phone, aid):
    pass
@retry(
    stop=stop_after_attempt(1), 
    wait=wait_exponential(multiplier=1, min=4, max=10),  
    retry_error_callback=lambda retry_state: print(f"Retrying conversionRights, attempt {retry_state.attempt_number}") 
)
async def conversionRights(phone, aid,SS,ckvalue,jsexec):
    pass
def sync_before_sleep(retry_state, phone, SS, ticket):
    pass

async def before_sleep(retry_state, phone, SS, ticket):
    pass

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    retry=retry_if_exception_type((httpx.ReadTimeout, httpx.HTTPError, ZeroDivisionError)),
    before_sleep=lambda retry_state: sync_before_sleep(retry_state, retry_state.args[0], retry_state.args[1], retry_state.args[2])
)
async def getLevelRightsList(phone, SS, jsexec, **kwargs):
    pass

async def getSign(ticket,SS,ckvalue):
    try:
        response_data =await SS.get('https://wapside.189.cn:9001/jt-sign/ssoHomLogin?ticket=' + ticket,cookies=ckvalue)
        response_data = response_data.json()
        if response_data.get('resoultCode') == '0':
            sign = response_data.get('sign')
            return sign
        else:
            print(f"获取sign失败[{response_data.get('resoultCode')}]: {response_data}")
    except Exception as e:
        print(e)
    return None


async def parse_cookies(ck,rsCK):
    cookies = {}
    for part in ck.split(';'):
        part = part.strip()
        if '=' in part:
            key, value = part.split('=', 1)
            if 'path' not in key and 'expires' not in key and 'Secure' not in key and 'SameSite' not in key:
                cookies[key] = value
    cookies["yiUIIlbdQT3fO"] = rsCK           
    return cookies
async def ascii_add_2(number_str):
    transformed = ''.join(chr(ord(char) + 2) for char in number_str)
    return transformed
all_results = []

async def dxTask(phone, ticket, phoneV):
    global  diffValue, ready_count
    retry_count = 0
    max_retries = 3
    
    results = []  
    
    def format_message(msg):
        # if msg.get("code") == 0:
        #     return "success"
        if msg is None:
            msg = "走到这里则为特殊接口，后续再优化："+msg.get('errorMsg') or msg.get('err') or "响应返回为None(特殊情况可忽略)"
            # return "响应返回为None(特殊情况可忽略)"
            print(msg)
            return msg
        if "省编码校验失败" in msg:
            return "非本号省口令"
        elif "券码已使用" in msg:
            return "已使用"
        
        return msg

    while retry_count < max_retries:
        try:
            async with AsyncSessionManager() as s:
                phone2V=await ascii_add_2(phone)
                if 0== 0:
                    payload = {
                    "appType": "02",
                    "authCode": ticket,
                    "loginType": "1"
                    }
                    s.headers.update({
                        'Accept': "application/json, text/plain, */*",
                        'Cache-Control': "no-cache",
                        'appType': "02",
                        'userId': "",
                        'Content-Type': "application/json;charset=UTF-8",
                        'sessionKey': "",
                        'Origin': "https://wapact.189.cn:9001",
                        'Referer': "https://wapact.189.cn:9001/flcj1/",
                    })
                    response=await s.post('https://waphub.189.cn/yzf1/dispatch/login',  data=json.dumps(payload))
                    if response.status_code == 200:
                        print(f"账户:{get_first_three(phone)} 登录兑换任务成功")
                        login = response.json()
                        if login['success'] == True:
                            phone2V=await ascii_add_2(phone)
                            useridv=login["result"]["userId"]
                            sessionKey=login["result"]["sessionKey"]
                            productNo=login["result"]["productNo"]
                            if useridv:
                                for code in WELFARE_CODES:
                                    print("开始兑换口令码:",code)
                                    convertpayload = {
                                        "userId": useridv,
                                        "code": code,
                                        "telephone": productNo,
                                        "isNewUser": "0"
                                    }
                                    
                                    s.headers.update({
                                    'userId':useridv,
                                    'sessionKey': sessionKey,
                                    })
                                    response=await s.post('https://waphub.189.cn/yzf1/welfare/convert',  data=json.dumps(convertpayload))
                                    if response.status_code == 200:
                                            convert=response.json()
                                            if convert.get('success') == True:
                                                results.append({
                                                    'phone': get_first_three(phone),
                                                    'code': code,
                                                    'status': '✓', 
                                                    'message': '成功',
                                                    'time': datetime.datetime.now().strftime("%H:%M:%S")
                                                })
                                            elif convert.get('success') == False:
                                                # if convert.get('errorMsg') == '口令码已使用':
                                                    print("开始换接口兑换口令码:",code)

                                                    useridv=login["result"]["userId"]
                                                    sessionKey=login["result"]["sessionKey"]
                                                    provinceCode=login["result"]["provinceCode"]
                                                    provinceName=login["result"]["province"]
                                                    cityCode=login["result"]["cityCode"]
                                                    cityName=login["result"]["city"]
                                                    mob=login["result"]["productNo"]
                                                    # source=login["result"]["source"]

                                                    convertpayload = {
                                                        "code": code,
                                                        "userId": useridv,
                                                        "mob": mob,
                                                        "provinceCode": provinceCode,
                                                        "provinceName": provinceName,
                                                        "cityCode": cityCode,
                                                        "cityName": cityName,
                                                        "isNewUser": "0",
                                                        "source": "P201020101"
                                                    }
                                                    s.headers.update({
                                                    'userId':useridv,
                                                    'sessionKey': sessionKey,
                                                    })
                                                    await asyncio.sleep(5)
                                                    response=await s.post('https://wapact.189.cn:9001/yzf/code/writeOff',  data=json.dumps(convertpayload))
                                                    convert=response.json()
                                                    await asyncio.sleep(5)
                                                    if convert.get('success') == True or convert.get('code') == 0:
                                                        results.append({
                                                            'phone': get_first_three(phone),
                                                            'code': code,
                                                            'status': '✓',
                                                            'message': '成功',
                                                            'time': datetime.datetime.now().strftime("%H:%M:%S")
                                                        })
                                                    else:
                                                        results.append({
                                                            'phone': get_first_three(phone),
                                                            'code': code, 
                                                            'status': '✗', 
                                                            'message': format_message(convert),
                                                            'time': datetime.datetime.now().strftime("%H:%M:%S")
                                                    })


                        print("领取可能不及时到账,延迟5秒再去奖券查找可领取的奖品。")
                        await asyncio.sleep(5)
                        welfarelistUrl=f"https://waphub.189.cn/yzf1/welfare/list?userId={useridv}&telephone={quote(productNo)}"+"&state=0"
                        await asyncio.sleep(5)
                        response=await s.get(welfarelistUrl)
                        # print(productNo)
                        if response.status_code == 200:
                                datavv=response.json()
                                if datavv.get('success') != True:
                                    print("查询异常：",datavv)
                                    return

                                if datavv.get('result') is not None and len(datavv['result']) > 0 and datavv['result'][0] is not None:
                                    await asyncio.sleep(5)
                                    # print(datavv)
                                    dataVVVVList=datavv['result']
                                    for dataVVVV in dataVVVVList:
                                        if dataVVVV['name'] is not None and '元' in dataVVVV['name'] and '话费' in dataVVVV['name']:
                                            taskId = dataVVVV["id"]
                                            print("开始领取", dataVVVV['name'])
                                            verifypayload = {
                                                "userId": useridv,
                                                "id": taskId,
                                                "telephone": productNo,
                                                "source": "1"
                                            }
                                            await asyncio.sleep(5)
                                            try:
                                                response = await s.post(
                                                    'https://waphub.189.cn/yzf1/welfare/verify',  
                                                    data=json.dumps(verifypayload)
                                                )
                                                if response.status_code == 200:
                                                    verify = response.json()
                                                    if verify.get('success') == True:
                                                        results.append({
                                                            'phone': get_first_three(phone),
                                                            'code': dataVVVV['name'],
                                                            'status': '✓',  
                                                            'message': '成功',
                                                            'time': datetime.datetime.now().strftime("%H:%M:%S")
                                                        })
                                                    else:
                                                        results.append({
                                                            'phone': get_first_three(phone),
                                                            'code': dataVVVV['name'],
                                                            'status': '✗',
                                                            'message': format_message(verify.get('errorMsg')),
                                                            'time': datetime.datetime.now().strftime("%H:%M:%S")
                                                        })
                                            except Exception as e:
                                                print(f"验证请求失败: {str(e)}")
                                else:
                                    print("奖券已无可领取奖品或延迟不到账稍后重试:", datavv)
                        else:
                            print("领取失败:", datavv)
            break  

        except Exception as e:
            retry_count += 1
            if retry_count >= max_retries:
                print(f"账号 {get_first_three(phone)} 达到最大重试次数，跳过")
                break
            print(f"账号 {get_first_three(phone)} 发生错误: {str(e)}, 第 {retry_count} 次重试")
            await asyncio.sleep(5 * retry_count) 
    if results:
        global all_results
        all_results.extend(results)


async def get_session(session_pool):
    return session_pool[random.randint(0, len(session_pool) - 1)]


async def main(isTrue):
    tasks = []

    # phone_list = PHONES.split('@') 
    phone_list = re.split(r'[\n&%!]', PHONES)

    total_tasks = len(phone_list)
    print(f"总任务数：{total_tasks}")
    semaphore = asyncio.Semaphore(5)
    
    async def wrapped_task(phone, ticket, phoneV):
        
        async with semaphore:
            await dxTask(phone, ticket, phoneV)
    
    for index, phoneV in enumerate(phone_list, start=1):
        # value = phoneV.split('#')
        value = re.split(r'[#,@]', phoneV)

        print(f"正在处理任务 {index}/{total_tasks}")
        if len(value)<2:
            print('格式错误')
            continue
        phone, password, uid = value[0], value[1], value[-1]
        ticket = False 
        
        if phone in load_token:
            printn(f'{get_first_three(phone)} 使用缓存登录')
            ticket = get_ticket(phone, load_token[phone]['userId'], load_token[phone]['token'])
        
        if not ticket:
            printn(f'{get_first_three(phone)} 使用密码登录')
            ticket = userLoginNormal(phone, password)
        
        if ticket:
            tasks.append(asyncio.create_task(wrapped_task(phone, ticket, load_token[phone])))

            await asyncio.sleep(1)
        else:
            printn(f'{phone} 登录失败')
    try:
        await asyncio.gather(*tasks, return_exceptions=True)
        if all_results:
            df = pd.DataFrame(all_results)
            pd.set_option('display.max_colwidth', 30)
            from tabulate import tabulate
            stats_df = df.groupby('phone').agg({
                'status': lambda x: f"成功:{len([s for s in x if s=='✓'])} 失败:{len([s for s in x if s=='✗'])}"
            }).reset_index()
            stats_df.columns = ['手机号', '统计结果']
            
            print("\n执行结果:")
            print(tabulate(df, headers='keys', tablefmt='grid', showindex=False))
            
            print("\n统计结果(口令和话费合在一起没做处理。不过不重要):")
            print(tabulate(stats_df, headers='keys', tablefmt='grid', showindex=False))
            
    except Exception as e:
        print(f"任务执行出错: {str(e)}")


'''
电信口令python脚本

青龙变量：
号码变量：chinaTelecomAccount   或者PHONES1
口令变量：dx_kl
定时: 1 56 23 * * *
变量格式: 手机号@服务密码
多号创建多个变量或者&隔开
'''

WELFARE_CODE=os.environ.get('dx_kl') or "五一福利"
# WELFARE_CODE=os.environ.get('dx_kl') or "绑定福利,事事如意,2025加油,草长莺飞,888"
WELFARE_CODES = WELFARE_CODE.split(',') 

PHONES =os.environ.get('chinaTelecomAccount') or os.environ.get('PHONES1') or '''199069444444@899900'''

if __name__ == "__main__":
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', None)
    pd.set_option('display.max_colwidth', None)
    
    global timeValue, timeDiff
    print("开始等待场次时间:")
    h = datetime.datetime.now().hour
    print("当前小时为: " + str(h))
    random_m = random.randint(1, 59)
    wttime = ttt(1, 59, 1)  
    if 1 + 1 == 12:
        isTRUE = True
    else:
        isTRUE = False
    
    if wttime > time.time():
        wTime = wttime - time.time()
        print("未到时间,计算后差异:" + str(wTime) + "秒")
        if isTRUE:
            time.sleep(wTime)
        print("开始抢购")

    asyncio.run(main(isTRUE))
    


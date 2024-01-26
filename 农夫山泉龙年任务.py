"""
--------介绍--------------
搜 https://gateway.jmhd8.com/geement.marketinglottery/api/v1/marketinglottery
抽奖一次就出来

入口 #小程序://龙年吉祥/tanOZLnNuagiQfa

变量  apitoken#unique_identity#请求体#备注     
变量名 nfsqrw
多账号   换行/回车   
脚本作者: QGh3amllamll  
版本1.22
-----------更新说明--
1.1 更新  不运行游戏逻辑
1.2 更新白嫖每日抽奖   
1.21   固定抽奖每日抽奖id 
1.22   更新 浏览公众号文章  自动匹配/遍历任务 (默认固定任务)
-------------使用说明--
user_agent 复制一个进去脚本就可以

"""
import os
import requests
from datetime import datetime, timezone, timedelta
import json
import time
import random

#---------简化的框架0.2--------
#-----本地使用方法-----

#本地测试用 下面nfsqrwcs 改成nfsqrw    变量放进去就可以
os.environ['nfsqrwcs'] = '''
apitoken#unique_identity#unique_identity#备注  
apitoken#unique_identity#unique_identity#备注  
apitoken#unique_identity#unique_identity#备注  
'''
#-------本地运行------



#-------------配置参数  开始----------------------------
base_url = "https://gateway.jmhd8.com"  # 修改为实际的基础URL
user_agent = ""
rwbl = 0  # 任务中心函数开关变量   0固定任务    1 遍历任务版（自动匹配）   默认固定版

#user_agent = ""备份

#----------------------设置完成----------------------------
def get_beijing_date():  # 获取北京日期的函数
    beijing_time = datetime.now(timezone(timedelta(hours=8)))
    return beijing_time.date()

def get_env_variable(var_name):
    value = os.getenv(var_name)
    if value is None:
        print(f'环境变量{var_name}未设置，请检查。')
        return None
    # 从环境变量中解析账号信息
    accounts = value.strip().split('\n')  # 假设每行是一个账户信息
    num_accounts = len(accounts)  # 计算账号数量
    print(f'-----------本次账号运行数量：{num_accounts}-----------')
    print(f'-----------农夫山泉龙年任务-----------')
    print(f'-----------脚本作者: QGh3amllamll  -----------')

    return accounts

def get_action_time():#当前时间并格式化为URL编码
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    action_time = current_time.replace(" ", "%20")
    #print(f"格式化后的时间: {action_time}")  # 打印格式化后的时间
    return action_time

def build_headers(api_token, unique_identity):#构建请求头/封装
    """构建请求头"""
    return {
        'Host': 'gateway.jmhd8.com',
        'Connection': 'keep-alive',
        'apitoken': api_token,
        'charset': 'utf-8',
        'User-Agent': user_agent,
        'unique_identity': unique_identity,
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'gzip,compress,br,deflate',
        #'Referer': 'https://servicewechat.com/wxd79ec05386a78727/65/page-frame.html',
    }

def rwzx1_gd(api_token, unique_identity):  # 任务中心函数
    url = f"{base_url}/geement.marketingplay/api/v1/task?pageNum=1&pageSize=10&task_status=2&status=1&group_id=23122117303222"
    headers = build_headers(api_token, unique_identity)

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # 检查HTTP错误

        try:
            response_data = response.json()
            #print("解析的JSON数据：", response_data)

            tasks_to_run = False

            # 在迭代之前检查 'data' 是否为None或者是否可以迭代
            if response_data and 'data' in response_data and isinstance(response_data['data'], list):
                for item in response_data['data']:
                    task_name = item.get('name')
                    complete_status = item.get('complete_status')

                    if complete_status == 0:
                        tasks_to_run = True
                        if task_name == "每日签到":
                            submit_task(api_token, unique_identity, item.get('id'), "签到")
                        elif task_name == "访问视频号":
                            submit_task(api_token, unique_identity, item.get('id'), "视频号")
                        elif task_name == "向好友分享活动":
                            submit_task(api_token, unique_identity, item.get('id'), "向好友分享活动")
                        elif task_name == "浏览公众号文章":
                            submit_task(api_token, unique_identity, item.get('id'), "浏览公众号文章")

                        # 随机等待3到5秒
                        time.sleep(random.randint(3, 5))

                    elif complete_status == 1:
                        print(f"{task_name}💬 次数{complete_status} ❌不运行")

            if tasks_to_run:
                # 运行游戏逻辑
                yxid(api_token, unique_identity)  # 传入适当的user_id
            else:
                print("所有任务已完成，不运行游戏")

            return response_data  # 返回解析后的JSON数据
        except ValueError:
            print("响应不是有效的JSON格式。")
            return None

    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
        return None

def rwzx_blb(api_token, unique_identity):  # 任务中心函数  遍历任务 版 
    url = f"{base_url}/geement.marketingplay/api/v1/task?pageNum=1&pageSize=10&task_status=2&status=1&group_id=23122117303222"
    headers = build_headers(api_token, unique_identity)

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # 检查HTTP错误

        try:
            response_data = response.json()
            tasks_to_run = False

            # 
            if response_data and 'data' in response_data and isinstance(response_data['data'], list):
                for item in response_data['data']:
                    task_name = item.get('name')
                    task_id = item.get('id')
                    complete_status = item.get('complete_status')

                    if complete_status == 0:
                        tasks_to_run = True
                        submit_task(api_token, unique_identity, task_id, task_name)  # 直接使用任务名称

                        # 随机等待3到5秒
                        time.sleep(random.randint(3, 5))

                    elif complete_status == 1:
                        print(f"{task_name}💬 次数{complete_status} ❌不运行")

            if tasks_to_run:
                # 运行游戏逻辑
                yxid(api_token, unique_identity)  
            else:
                print("所有任务已完成，不运行游戏")

            return response_data
        except ValueError:
            print("响应不是有效的JSON格式。")
            return None

    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
        return None



def submit_task(api_token, unique_identity, task_id, task_type):#通用的任务提交函数
    """通用的任务提交函数"""
    action_time = get_action_time()
    url = f"{base_url}/geement.marketingplay/api/v1/task/join?action_time={action_time}&task_id={task_id}"
    headers = build_headers(api_token, unique_identity)
    #print(f"{url}:",, "")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        try:
            response_data = response.json()
            msg = response_data.get('msg', '无消息内容')
            #print(f"{task_type}响应消息：", msg)
            #print(f"{task_type}:", msg)
            print(f"{task_type}💬:", msg, "✅")

            return response_data
        except ValueError:
            print(f"{task_type}响应不是有效的JSON格式。")
            return None
    except requests.exceptions.RequestException as e:
        print(f"{task_type}请求失败: {e}")
        return None 

def yxid(api_token, unique_identity):  # 获取游戏id
    url = f"{base_url}/geement.actjextra/api/v1/act/check?act_code=ACT42582331778956001281600711680"
    headers = build_headers(api_token, unique_identity)

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status() 
        response_data = response.json()  
        #print("解析的游戏JSON数据：", response_data)

        
    
        if 'data' in response_data and 'user_id' in response_data['data']:
            user_id = response_data['data']['user_id']
            #print("提取的 user_id：", user_id)

            # 运行游戏逻辑
            if user_id:
                yxlj(api_token, unique_identity, user_id)
            else:
                print("无法获取 user_id，无法提交分数。")

            return user_id
        else:
            print("user_id 不存在于响应数据中。")
            return None

    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
        return None

def yxlj(api_token, unique_identity, user_id):  #提交游戏
    while True:  # 用循环来重发请求
        score = random.randint(90, 140)  # 生成一个90到140之间的随机分数
        url = f"https://www.ukh5.com/g/12/PaoKu/api.php?a=sumbitscore&openid={user_id}&score={score}"
        #print(url)
        headers = {
            'host': 'www.ukh5.com',
            'content-length': '0',
            'unique_identity': unique_identity,
            'accept': '*/*',
            'origin': 'https://www.ukh5.com',
            'x-requested-with': 'com.tencent.mm',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://www.ukh5.com/g/12/PaoKu/index.html?beecre_user_id=U2401020434032181600711680',        
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            # 'cookie': 'PHPSESSID=f6da2789f2aca3e870e0b041d8ab72db',
        }

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()  # 检查HTTP错误
            response_data = response.json()  # 获取JSON数据
            #print("解析的JSON数据：", response_data)
            
            # 提取并打印info字段
            info = response_data.get('info', 'No info available')
            #print(f"Info: {info}")

            # 提取data字段中的status和num
            data = response_data.get('data', {})
            status = data.get('status')
            num = data.get('num')

            if status is not None and num is not None:
                # print(f" {info} Status: {status} 游戏次数: {num}")
                print(f" 游戏响应{info} 游戏次数: {num}")

                # 如果status为0，打印嵌套在data内的data内容
                if status == 0 and 'data' in data:
                    nested_data = data['data']
                    print(f"游戏？？: {nested_data}")

                    time.sleep(3)  # 如果状态为0，等待3-5秒后重试
                    continue

            return response_data  # 返回解析后的JSON数据

        except requests.exceptions.RequestException as e:
            print(f"请求失败: {e}")
            return None

#抽奖
def cxlscj(api_token, unique_identity):  #查询历史抽奖/领取？
    url = "https://gateway.jmhd8.com/geement.usercenter/api/v1/user/seniority?sencodes=SEN42583085600829603841600711680"
    headers = build_headers(api_token, unique_identity)

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        response_data = response.json()
        code = response_data.get('code')

        if code == 200:
            # 当code为200时处理逻辑
            data = response_data.get('data', [])
            for item in data:
                total_count = item.get('total_count', 0)
                used_count = item.get('used_count', 0)
                hycs = total_count - used_count

                print(f"总次数: {total_count}, 已用次数: {used_count}, 剩余次数: {hycs}")
        else:
            # 打印非200响应的完整响应体
            print("完整响应体：", response.text)

        return response_data

    except ValueError:
        print("响应不是有效的JSON格式。")
        return None
    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
        return None

def jrmfcjcs(api_token, unique_identity, datacj):  # 今日免费抽奖次数
    url = "https://gateway.jmhd8.com/geement.actjextra/api/v1/act/lottery/data/todaycount?act_code=ACT42582331778956001281600711680"
    headers = build_headers(api_token, unique_identity)

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        response_data = response.json()

        if response_data.get('code') == 200:
            used_draws = response_data.get('data')
            total_free_draws = 3  # 每天有3次免费抽奖机会
            remaining_draws = total_free_draws - used_draws

            if remaining_draws > 0:
                print(f"您还有 {remaining_draws} 次免费抽奖机会。")
                for _ in range(remaining_draws):
                    lottery_draw(api_token, unique_identity, datacj)  # 多次调用抽奖
            else:
                print("今日的免费抽奖机会已经用完。")

    except ValueError:
        print("响应不是有效的JSON格式。")
        return None
    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
        return None

def lottery_draw(api_token, unique_identity, datacj):  # 正确提交抽奖数据
    url = "https://gateway.jmhd8.com/geement.marketinglottery/api/v1/marketinglottery"

    headers = {
        'host': 'gateway.jmhd8.com',
        'content-length': '288',
        'content-type': 'application/json',
        'charset': 'utf-8',
        'apitoken': api_token,
        'User-Agent': user_agent,
        'unique_identity': unique_identity,
        'xweb_xhr': '1',
        'accept': '*/*',
        'accept-language': '*',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'accept-encoding': 'gzip, deflate, br',
    }
    #print(datacj)
    data = json.loads(datacj)
    # 更改code值
    data['code'] = "SCENE-202312221126017708681600711680"
    
    try:
        # 发送POST请求
        #updated_data_json = json.dumps(data, ensure_ascii=False)
        #print("发送的data:", updated_data_json)
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        # 如需打印请求体和完整响应体，取消以下两行的注释
        # print("请求体:", json.dumps(data))
        # print("完整响应体：", response.text)

        try:
            # 解析响应体的JSON内容
            response_data = response.json()
            code = response_data.get('code')
            msg = response_data.get('msg')

            if code == 200:
                # 如果code为200，处理并打印奖品信息
                prize_info = response_data.get('data', {}).get('prizedto', {})
                prize_name = prize_info.get('prize_name')
                prize_level = prize_info.get('prize_level')
                print(f"🎉奖品名称: {prize_name}, 奖品等级: {prize_level}")
            elif code == 500:
                # 如果code为500，只打印消息
                print(f"消息: {msg}")
            else:
                # 对于其他情况，打印完整响应
                print("完整响应体：", response.text)

            return response_data
        except ValueError:
            print("响应不是有效的JSON格式。")
            return None

    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
        return None

def cxcjsju(api_token, unique_identity):  # 查询抽奖/历史中奖
    url = f"{base_url}/geement.actjextra/api/v1/act/win/goods/simple?act_codes=ACT42582331778956001281600711680,ACT42583272504384552961600711680"
    headers = build_headers(api_token, unique_identity)

    try:
        # 发送GET请求
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        try:
            response_data = response.json()
            if 'data' in response_data and isinstance(response_data['data'], list):
                special_prize = "特等奖-龙年生肖水一套"
                special_prizes = []

                for item in response_data['data']:
                    scan_time = item.get('scan_time', '无scan_time字段')
                    win_prize_name = item.get('win_prize_name', '无win_prize_name字段')
                    #print(f"时间：{scan_time} 中奖名称：{win_prize_name}")

                    # 检查是否有特等奖，并记录扫描时间
                    if win_prize_name == special_prize:
                        special_prizes.append((scan_time, win_prize_name))

                print(f"总中奖次数：{len(response_data['data'])}")
                if special_prizes:
                    print("-----------")
                    for scan_time, prize_name in special_prizes:
                        print(f"获得特别奖项：{prize_name}，时间：{scan_time}")

            else:
                print("响应JSON中没有data字段或data不是一个列表。")

        except ValueError:
            print("响应不是有效的JSON格式。")
            return None

    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
        return None


def main():
    var_name = 'nfsqrw'  # 实际的环境变量名
    tokens = get_env_variable(var_name)  # 使用函数获取环境变量中的令牌列表
    if tokens is None:
        return  # 如果令牌列表为空，则退出

    total_tokens = len(tokens)  # 总令牌数量
    #rwbl = 0  # 开关变量

    for index, token in enumerate(tokens, start=1):  # 遍历所有令牌
        parts = token.split('#')
        if len(parts) < 3:
            print("令牌格式错误，应为 'apitoken#unique_identity#响应体#备注'")
            continue  # 跳过错误格式的令牌

        api_token, unique_identity, datacj = parts[0], parts[1], parts[2]
        remark = parts[3] if len(parts) > 3 else None  # 检查是否有备注

        # 打印当前处理的账号编号和备注信息
        remark_info = f"---备注: {remark}" if remark else ""
        print(f"------账号{index}/{total_tokens}{remark_info}-------")

        if rwbl == 0:
            rwzx1_gd(api_token, unique_identity)  # 任务中心
        elif rwbl == 1:
            rwzx_blb(api_token, unique_identity)  # 任务中心函数 遍历任务 版

        cxlscj(api_token, unique_identity)  # 查询历史抽奖/领取？
        jrmfcjcs(api_token, unique_identity, datacj)  # 今日免费抽奖次数
        cxcjsju(api_token, unique_identity)  # 查询抽奖/历史中奖
        
        # lottery_draw(api_token, unique_identity, datacj)  # 提交抽奖

if __name__ == "__main__":
    main()

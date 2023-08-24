# 火山版-安卓
# 抓包内容：开一次宝箱，搜索 task_done/
# 变量名 androind_hotmoon,可以自己更改
# 变量内容：url#cookie#x-argus#x-ladon
import os
import random
import re
import time
import requests
from jsonsearch import JsonSearch
from notify import send

count = 10  # 刷视频次数
cookies = os.getenv('androind_hotmoon')
# ua = 'com.ss.android.ugc.live/250701 (Linux; U; Android 9; zh_CN; A2644; Build/PKQ1.180729.001; Cronet/TTNetVersion:33b1486f 2023-04-19 QuicVersion:6ea2111b 2023-03-16)'  # 填写个人ua

ua = 'com.ss.android.ugc.live/250301 (Linux; U; Android 10; zh_CN; Redmi Note 9; Build/PKQ1.190616.001; Cronet/TTNetVersion:8e43839d 2023-03-22 QuicVersion:6ea2111b 2023-03-16)'


class hotMoonUser():
	sdk_version = '2'
	passport_sdk_version = '203107'

	flame_token = ''
	task_signToken = ''
	task_openTreasureToken = ''
	task_openTreasureVideoToken = ''
	task_adToken = ''
	sign_info = ''
	treasure_chest_timestamp = 0
	ad_timestamp = 0
	notify_message = ''

	def __init__(self, cookie1):
		self.task_url = cookie1.split("#")[0]
		self.cookie = cookie1.split("#")[1]
		self.argus = cookie1.split("#")[2]
		self.ladon = cookie1.split("#")[3]
		self.params = re.findall('\?(.*?)$', self.task_url)[0]

	# 查询所有任务列表
	def findAllTaskList(self, time1):
		ad_info = None
		sign_data = None
		url = 'https://hotsoon.snssdk.com/hotsoon/janus/flame/management/panel/?' + self.params
		host = re.findall('https://(.*?)/', url)[0]
		str1 = re.findall('_rticket=(.*?)&', url)[0]  # 13位时间戳
		str2 = re.findall('ts=(.*?)&', url)[0]  # 10位时间戳
		url = url.replace(str1, str(int(time1 * 1000)))
		url = url.replace(str2, str(int(time1)))

		host = re.findall('https://(.*?)/', url)[0]

		headers = {
			'Host': host,
			'User-Agent': ua,
			'Connection': 'close',
			'Accept': '*/*',
			'Accept-Encoding': 'gzip, deflate',
			'sdk-version': self.sdk_version,
			'passport-sdk-version': self.passport_sdk_version,
			'Cookie': self.cookie
		}

		try:
			res = requests.get(url=url, headers=headers)
			print(res.json())
			jsondata = JsonSearch(object=res.text, mode='s')

			sign_info1 = jsondata.search_all_value(key='check_in_task')
			sign_info2 = jsondata.search_all_value(key='check_in_v2_task')
			for temp in sign_info1:
				if temp is not None and 'token' in temp and 'check_in_today' in temp:
					sign_data = temp
			for temp in sign_info2:
				if temp is not None and 'token' in temp and 'check_in_today' in temp:
					sign_data = temp
			# print(sign_data)
			if 'check_in_today' in sign_data and 'token' in sign_data:
				self.sign_info = sign_data.get('check_in_today')
				self.task_signToken = sign_data.get('token')

			# print(self.sign_info)
			# print(self.task_signToken)

			ad_task_arr = jsondata.search_all_value(key='ad_task')
			for ad_task_info in ad_task_arr:
				if ad_task_info is not None:
					ad_info = ad_task_info
			treasure_chest_info = jsondata.search_first_value('treasure_chest_info')

			if 'last_award_timestamp' in ad_info:
				self.ad_timestamp = ad_info.get('last_award_timestamp')
			if 'token' in ad_info:
				self.task_adToken = ad_info.get('token')
			if 'last_award_timestamp' in treasure_chest_info.get('data'):
				self.treasure_chest_timestamp = treasure_chest_info.get('data').get('last_award_timestamp')
			if 'token' in treasure_chest_info.get('data'):
				self.task_openTreasureToken = treasure_chest_info.get('data').get('token')
		except Exception:
			print('获取任务列表异常')
			self.notify_message += '获取任务列表异常\n'
			exit(-1)

	# 获取20秒视频任务的第一个token
	def get_flame_task_info(self, time):
		url = 'https://api5-normal-c-hl.amemv.com/hotsoon/flame/task_info/?' + self.params
		host = re.findall('https://(.*?)/', url)[0]
		str1 = re.findall('_rticket=(.*?)&', url)[0]  # 13位时间戳
		str2 = re.findall('ts=(.*?)&', url)[0]  # 10位时间戳
		url = url.replace(str1, str(int(time * 1000)))
		url = url.replace(str2, str(int(time)))

		headers = {
			'Host': host,
			'User-Agent': ua,
			'Connection': 'close',
			'Accept': '*/*',
			'Accept-Encoding': 'gzip, deflate',
			'sdk-version': self.sdk_version,
			'passport-sdk-version': self.passport_sdk_version,
			'Cookie': self.cookie
		}
		res = requests.get(url=url, headers=headers)
		# print(res.text)
		# print(res.json().get("data").get("has_next"))
		try:
			if res.json().get("data").get("has_next") == 1:
				# (res.json().get("data").get("next_token"))
				self.flame_token = res.json().get("data").get("next_token")
				return 1
			else:
				print('视频刷完')
				self.notify_message += '视频刷完\n'
				exit(0)
		except Exception:
			self.notify_message += '获取视频异常\n'
			print('获取视频异常')

	# 看20秒视频
	def read20sVideo(self, time):
		url = 'https://api5-normal-c-lf.amemv.com/hotsoon/flame/task_done/?' + self.params
		host = re.findall('https://(.*?)/', url)[0]
		str1 = re.findall('_rticket=(.*?)&', url)[0]  # 13位时间戳
		str2 = re.findall('ts=(.*?)&', url)[0]  # 10位时间戳
		url = url.replace(str1, str(int(time * 1000)))
		url = url.replace(str2, str(int(time)))

		payload = f'token={self.flame_token}'
		headers = {
			'Host': host,
			'User-Agent': ua,
			'Connection': 'close',
			'Content-Length': str(len(payload)),
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'sdk-version': self.sdk_version,
			'passport-sdk-version': self.passport_sdk_version,
			'Cookie': self.cookie
		}
		res = requests.post(url=url, headers=headers, data=payload)
		# print(res.text)
		# print(res.json().get("data").get("has_next"))
		try:
			award = res.json().get("data").get("flame_amount")
			if 0 != int(award):
				print(f'刷视频奖励{award}')
				self.notify_message += f'刷视频奖励{award}\n'
				if res.json().get("data").get("has_next") == 1:
					# print(res.json().get("data").get("next_token"))
					self.flame_token = res.json().get("data").get("next_token")
					return 1
				else:
					return 0
			else:
				print('已刷满视频')
				self.notify_message += '已刷满视频\n'
				exit(0)
		except Exception:
			self.notify_message += '刷视频异常\n'
			print('刷视频异常')

	# 看20秒广告，20分钟一次
	def readAD(self, time1):
		# 最后的 + 1200 < 当前的
		if self.ad_timestamp != 0 and time1 < (self.ad_timestamp + 1200) and len(self.task_adToken):
			print('【看20分钟一次广告】未到时间')
			return
		elif 0 == len(self.task_adToken):
			print('没20分钟一次的广告任务了')
			return
		url = 'https://hotsoon.snssdk.com/hotsoon/flame/task_system/task_done/?' + self.params
		host = re.findall('https://(.*?)/', url)[0]
		payload = f'task_name=ad&auto_finish=false&token={self.task_adToken}'
		headers = {
			'Host': host,
			'User-Agent': ua,
			'Connection': 'close',
			'Content-Length': str(len(payload)),
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'sdk-version': self.sdk_version,
			'passport-sdk-version': self.passport_sdk_version,
			'x-argus': self.argus,
			'x-ladon': self.ladon,
			'Cookie': self.cookie
		}
		try:
			res = requests.post(url=url, headers=headers, data=payload)
			# print(res.text)
			award = res.json().get('data').get('task_done_award').get('flame_amount')
			self.notify_message += f'【看广告】获得{award}\n'
			print(f'看广告获得{award}')
		except Exception:
			self.notify_message += '【看广告】异常\n'
			print('看广告异常')

	# 开宝箱 30分钟一次
	def openTreasure(self, time1):
		if self.treasure_chest_timestamp != 0 and time1 < (self.treasure_chest_timestamp + 1800) and len(
				self.task_openTreasureToken):
			print('【开宝箱】未到时间')
			return
		elif 0 == len(self.task_openTreasureToken):
			print('没开宝箱任务了')
			return
		time.sleep(random.uniform(2, 5))
		url = 'https://hotsoon.snssdk.com/hotsoon/flame/task_system/task_done/?' + self.params
		host = re.findall('https://(.*?)/', url)[0]
		payload = f'task_name=treasure_chest_check_in&auto_finish=false&token={self.task_openTreasureToken}'
		headers = {
			'Host': host,
			'User-Agent': ua,
			'Connection': 'close',
			'Content-Length': str(len(payload)),
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'sdk-version': self.sdk_version,
			'passport-sdk-version': self.passport_sdk_version,
			'x-argus': self.argus,
			'x-ladon': self.ladon,
			'Cookie': self.cookie
		}
		try:
			res = requests.post(url=url, headers=headers, data=payload)
			# print(res.text)
			award = res.json().get('data').get('task_done_award').get('flame_amount')
			print(f'开宝箱获得{award}')
			self.notify_message += f'【开宝箱】获得{award}\n'
			jsondata = JsonSearch(object=res.text, mode='s')
			if len(jsondata.search_first_value('ad_token')):
				self.task_openTreasureVideoToken = jsondata.search_first_value('ad_token')
		except Exception:
			self.notify_message += '【开宝箱】异常\n'
			print('开宝箱异常')

	# 30分钟一次
	def readTreasureVideo(self):
		if len(self.task_openTreasureVideoToken):
			time.sleep(random.uniform(1, 2))
			url = 'https://hotsoon.snssdk.com/hotsoon/flame/task_system/task_done/?' + self.params
			host = re.findall('https://(.*?)/', url)[0]
			payload = f'task_name=treasure_chest_ad&auto_finish=false&token={self.task_openTreasureVideoToken}'
			headers = {
				'Host': host,
				'User-Agent': ua,
				'Connection': 'close',
				'Content-Length': str(len(payload)),
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'sdk-version': self.sdk_version,
				'passport-sdk-version': self.passport_sdk_version,
				'x-argus': self.argus,
				'x-ladon': self.ladon,
				'Cookie': self.cookie
			}
			try:
				res = requests.post(url=url, headers=headers, data=payload)
				# print(res.text)
				award = res.json().get('data').get('task_done_award').get('flame_amount')
				print(f'看宝箱广告获得{award}')
				self.notify_message += f'【看宝箱广告】获得{award}\n'
			except Exception:
				self.notify_message += '【看宝箱广告】异常\n'
				print('看宝箱广告异常')
		else:
			print('没有宝箱广告任务了')
			self.notify_message += '没有宝箱广告任务了\n'

	def sign(self):
		if self.sign_info:
			print('已签到')
			return
		time.sleep(random.uniform(2, 5))
		url = 'https://hotsoon.snssdk.com/hotsoon/flame/task_system/task_done/?' + self.params
		host = re.findall('https://(.*?)/', url)[0]
		payload = f'task_name=check_in_v2&auto_finish=false&token={self.task_signToken}'
		headers = {
			'Host': host,
			'User-Agent': ua,
			'Connection': 'close',
			'Content-Length': str(len(payload)),
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'sdk-version': self.sdk_version,
			'passport-sdk-version': self.passport_sdk_version,
			'x-argus': self.argus,
			'x-ladon': self.ladon,
			'Cookie': self.cookie
		}
		try:
			res = requests.post(url=url, headers=headers, data=payload)
			# print(res.text)
			award = res.json().get('data').get('task_done_award').get('flame_amount')
			print(f'签到获得{award}')
			self.notify_message += f'【签到】获得{award}\n'
		except Exception:
			print('签到异常')
			self.notify_message += '签到异常\n'

	def run(self):
		time1 = time.time()
		self.findAllTaskList(time1)
		self.sign()
		time1 = time.time()
		self.openTreasure(time1)
		self.readTreasureVideo()
		time.sleep(random.uniform(25, 30))
		time1 = time.time()
		self.readAD(time1)
		time.sleep(random.uniform(2, 8))
		time1 = time.time()
		status = self.get_flame_task_info(time1)
		# 0为已完成
		if 0 == status:
			exit(0)
		for i in range(int(count)):
			time.sleep(random.randint(25, 30))
			time1 = time.time()
			# print(time1)
			self.read20sVideo(time1)


def checkCookie(cookie1):
	try:
		task_url = cookie1.split("#")[0]
		_cookie = cookie1.split("#")[1]
		argus = cookie1.split("#")[2]
		ladon = cookie1.split("#")[3]
		params = re.findall('\?(.*?)$', task_url)[0]
		return 1
	except Exception:
		print('变量填写错误')
		return 0


if __name__ == "__main__":
	user_cookie = cookies.split('\n')
	print(f"火山版共获取到{len(user_cookie)}个账号")
	i = 1
	notifyMessage = ''
	title = '火山版通知'
	for cookie in user_cookie:
		print(f"---开始第{i}个账号---")
		if checkCookie(cookie) == 0:
			continue
		user = hotMoonUser(cookie)
		user.run()
		# print(user.notify_message)
		notifyMessage += f'-----第{i}个账号-----\n'
		notifyMessage += user.notify_message
		notifyMessage += '\n'
		if i < len(user_cookie):
			i += 1
			time.sleep(random.randint(60, 200))
	# send(title, notifyMessage)
	print('发送通知成功')

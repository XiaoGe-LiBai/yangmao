#cron: 0 0/15 * * * *
#const $ = new Env("沃畅游");
#妖火
import requests
import json

url = 'https://game.wostore.cn/api/app/user/v2/qos/start'
headers = {
    'authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjo4Mjc2MzY0NjIyOTY0NjU0MDgsInVzZXJfa2V5IjoiMTkzMzJlYjMtZTRhNy00ZmVjLTllN2EtZjdhOTg2MDE3NThlIiwidXNlcm5hbWUiOiJsKuaYjiJ9.AG5aZAC7q8QRDE2FJZrZylaGSS1fJeb9Phgz4bl2LUHCNB2wfW-jZpsAmmAJ3DLZDFbsWghWV8SPxV9Kf8z_tQ',
    'content-type': 'application/json'
}
body = {"channelId": "90002", "privateIp": "10.1.10.1"}

response = requests.post(url, headers=headers, data=json.dumps(body))

print(response.text)

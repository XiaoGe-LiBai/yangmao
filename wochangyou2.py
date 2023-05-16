#cron: 0 0/15 * * * *
#const $ = new Env("沃畅游");
#妖火
import requests
import json

url = 'https://game.wostore.cn/api/app/user/v2/qos/start'
headers = {
    'authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjo4Mjc2MzY0NjIyOTY0NjU0MDgsInVzZXJfa2V5IjoiNWQxOTdkN2YtNDEyOC00M2RlLWEwZDktNGE3ZWRjZTE5MmQ5IiwidXNlcm5hbWUiOiJsKuaYjiJ9.0aGm6G9sm5x2KuGC2T9CCHaM1H8ClS5qIRGvRXoPDM1s7L7vR754D-Vv5jHnoEttM9h-ezghKf8Z8cHCQdX3CA',
    'user-agent': 'okhttp/4.9.2',
    'content-type': 'application/json'
}
body = {"channelId": "90002", "privateIp": "10.1.10.1"}

response = requests.post(url, headers=headers, data=json.dumps(body))

print(response.text)

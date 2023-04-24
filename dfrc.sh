#!/bin/bash
#抓包小程序东风日产，域名community.dongfeng-nissan.com.cn。抓authorization的值，把前面Bearer 的去掉再填入括号内。多个账号的authorization用空格隔开，每日任务积分有限，最好定时早点做，ck有效期约两周
#By-莫老师 

###变量填写区开始，多账号的authorization用空格隔开
authorization=(eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BocC1hcGkubmlzc2FuLWNvbW11bml0eS5zdmMuY2x1c3Rlci5sb2NhbC9hcGkvdjIvdXNlcl9tYW5hZ2UvZ2V0X3Rva2VuIiwiaWF0IjoxNjgyMTI1NjIyLCJleHAiOjE2ODM0MjE2MjIsIm5iZiI6MTY4MjEyNTYyMiwianRpIjoiaHZMYnNiUEJMSnlwdDZrOCIsInN1YiI6NTE5NjA2NiwicHJ2IjoiNDhlNDUzODMxY2ViYTVlNTdhNDc1ZTY4NjQ5Y2ZkZWU2ZTk3ZDhkMiJ9.SFJzM2WDsgeqgRVpvqNPdHg4VUE-mEWnONmt4FJLYkq eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NvbW11bml0eS5kb25nZmVuZy1uaXNzYW4uY29tLmNuL2FwaS92Mi91c2VyX21hbmFnZS93eGxvZ2luIiwiaWF0IjoxNjgyMjE1ODM0LCJleHAiOjE2ODM1MTE4MzQsIm5iZiI6MTY4MjIxNTgzNCwianRpIjoieG5wdWRuVmRHVVdzcUxxOSIsInN1YiI6NTE5Mjk5NiwicHJ2IjoiNDhlNDUzODMxY2ViYTVlNTdhNDc1ZTY4NjQ5Y2ZkZWU2ZTk3ZDhksiJ9.MncBz2N0fnSFh4S9AiQ3-iLGTyahKYX4Z6xmj1uqIUI eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NvbW11bml0eS5kb25nZmVuZy1uaXNzYW4uY29tLmNuL2FwaS92Mi91c2VyX21hbmFnZS93eGxvZ2luIiwiaWF0IjoxNjgyMjE2Mzk2LCJleHAiOjE2ODM1MTIzOTYsIm5iZiI6MTY4MjIxNjM5NiwianRpIjoikzJpTW9ZWUVwSHpaRnFRTCIsInN1YiI6NTE5MzQwNywicHJ2IjoiNDhlNDUzODMxY2ViYTVlNTdhNDc1ZTY4NjQ5Y2ZkZWU2ZTk3ZDhkMiJ9.4FPbdae5BmLCOTXM2BHbW_a9jJ-vFlDrRaRWn8PBRfo eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NvbW11bml0eS5kb25nZmVuZy1uaXNzYW4uY29tLmNuL2FwaS92Mi91c2VyX21hbmFnZS93eGxvZ2luIiwiaWF0IjoxNjgyMjE2ODA5LCJleHAiOjE2ODM1MTI4MDksIm5iZiI6MTY4MjIxNjgwOSwianRpIjoiaVR5TlJQcm93WFlQTVdzZSIsInN1YiI6NTIwMjx0MywicHJ2IjoiNDhlNDUzODMxY2ViYTVlNTdhNDc1ZTY4NjQ5Y2ZkZWU2ZTk3ZDhkMiJ9.0Ex2TkW_JcKi925QeZJHCQ9pKB6g7d3YUoKosa5G7B4)
#wxpuzher推送参数
topicIds=8069
apptoken=AT_QsuUtsdI9R4nlFKEYN9xLL0SEa7uih7Z
###变量填写区结束


url=community.dongfeng-nissan.com.cn
pl(){
comment=$(curl -s "https://v1.hitokoto.cn/?encode=text" -k)
length=$(($(echo "$comment" | awk '{print length($0)}')+77))
msg=$(echo -e $(curl -s -X POST -H "Host: $url" -H "Content-Length: $length" -H "authorization: Bearer ${authorization[$s]}" -H "content-type: application/json" -d '{"commentable_type":"feeds","commentable_id":'$[$RANDOM%200000+1000000]',"body":"'$comment'","from_type":3}' "https://$url/api/v2/comments" -k) | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}' | sed 's/\"//g')
if [ "$msg" = 评论成功 ]; then
echo "日产账号$s第$i次评论成功"
else
pl
fi
}
dz(){
msg=$(echo -e $(curl -s -X POST -H "Host: $url" -H "authorization: Bearer ${authorization[$s]}" -H "content-type: application/json" -d "" "https://$url/api/v2/feeds/$[$RANDOM%200000+1000000]/like" -k) | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}' | sed 's/\"//g')
if [ "$msg" = 点赞成功 ]; then
echo "日产账号$s第$i次点赞成功"
dz
fi
}
gz(){
msg=$(echo -e $(curl -s -X PUT -H "Host: $url" -H "Content-Length: 16" -H "authorization: Bearer ${authorization[$s]}" -H "content-type: application/json" -d '{"isToast":true}' "https://$url/api/v2/user/followings/$[$RANDOM%200000+1000]" -k) | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}' | sed 's/\"//g')
if [ "$msg" = 关注成功 ]; then
echo "日产账号$s关注成功"
else
gz
fi
}
jq(){
msg=$(echo -e $(curl -s -X PUT -H "Host: $url" -H "Content-Length: 2" -H "authorization: Bearer ${authorization[$s]}" -H "accept: application/json" -d "{}" "https://$url/api/v2/user/feed-topics/$[$RANDOM%58+1]" -k) | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}' | sed 's/\"//g')
if [ "$msg" = 申请成功 ]; then
echo "日产账号$s加圈成功"
else
jq
fi
}
for s in $(seq 0 1 $((${#authorization[@]}-1)))
do
syrq=$(($(echo "${authorization[$s]}" | awk -F "." '{print $2}' | base64 -d | sed 's/,/\n/g' | grep "exp" | awk -F ":" '{print $2}')-$(date +%s)))
if [ "$syrq" -gt 0 ]; then
for i in $(seq 1 3)
do
pl
dz
done
gz
jq
else
echo "日产账号$s的authorization失效请重新抓"
curl -s -X POST -H "Host: wxpusher.zjiecode.com" -H "Content-Type: application/json" -d '{"appToken":"'$apptoken'","content":"日产账号'$s'的authorization失效请重新抓","contentType":1,"topicIds":['$topicIds'], "url":"https://wxpusher.zjiecode.com","verifyPay":false}' "https://wxpusher.zjiecode.com/api/send/message" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}'
fi
done
#!/bin/bash
#红旗智联积分任务，莫老师内部脚本
#抓包红旗智联app，新用户最好走邀请链接，有100积分，价值5元，别直接下载注册浪费了
#下载注册后抓hqapp.faw.cn域名，抓Authorization和aid两个参数，填在括号内，多账号空格隔开
#一天19分，一分价值0.05，每天定时运行一次即可
#cron: 15 0 * * *
#const $ = new Env("红旗智选");
Authorization=(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzIjoyNTkyMDAwLCJ1c2VyX2lkIjo4MTMwMTk5ODQ2MDYyNjUzNDQsImlzcyI6IlJCQUMtQVBJIiwidG9rZW5Gcm9tIjoiQVBQIiwiZXhwIjoxNjg1NTQyNjgwLCJpYXQiOjE2ODI5NTA2ODAsInNpZ25fdGltZSI6MTY4Mjk1MDY4MDY2OH0.FsMtD1jw4c0AW00qXBTyKNCXIHAOlYlgpLUjZqCMvjY)
aid=(1653041081332142082)
#wxpuzher推送参数
topicIds=
apptoken=


for s in $(seq 0 1 $((${#aid[@]}-1)))
do
syrq=$(($(echo "${Authorization[$s]}" | awk -F "." '{print $2}' | base64 -d | sed 's/,/\n/g' | grep "exp" | awk -F ":" '{print $2}')-$(date +%s)))
if [ "$syrq" -gt 0 ]; then
echo "红旗账号$s开始执行"
for i in $(seq 2 1 4)
do
curl -s -X POST -H "Authorization: ${Authorization[$s]}" -H "platform: 2" -H "aid: ${aid[$s]}" -H "Content-Type: application/json" -H "Content-Length: 17" -H "Host: hqapp.faw.cn" -d '{"scoreType":"'$i'"}' "https://hqapp.faw.cn/fawcshop/collect-public/v1/score/addScore" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}'
done
content=$(curl -s "https://v1.hitokoto.cn/?encode=text" -k)
length=$(($(echo "$content" | awk '{print length($0)}')+56))
tzid=$(curl -s -X POST -H "Authorization: ${Authorization[$s]}" -H "platform: 2" -H "aid: ${aid[$s]}" -H "Content-Type: application/json" -H "Content-Length: $length" -H "Host: hqapp.faw.cn" -d '{"province":"福建省","city":"福州市","content":"'$content'"}' "https://hqapp.faw.cn/fawcshop/collect-sns/v1/dynamicTopic/saveDynamicInfoImgUrl" -k | sed 's/,/\n/g' | grep "\"id\"" | awk -F ":" '{print $2}')
for i in $(seq 1 2)
do
comment=$(curl -s "https://v1.hitokoto.cn/?encode=text" -k)
length=$(($(echo "$comment$tzid" | awk '{print length($0)}')+88))
curl -s -X POST -H "Host: hqapp.faw.cn" -H "Content-Length: $length" -H "platform: 2" -H "Authorization: ${Authorization[$s]}" -H "aid: ${aid[$s]}" -H "Content-Type: application/json" -d '{"commentContext":"'$comment'","commentType":"8500","contentId":"'$tzid'","parentId":"0","fileString":[]}' "https://hqapp.faw.cn/fawcshop/collect-sns/v1/dynamicTopic/saveCommentDetailsRevision" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}'
done
content=$(curl -s "https://v1.hitokoto.cn/?encode=text" -k)
length=$(($(echo "$content" | awk '{print length($0)}')+63))
curl -s -X POST -H "Authorization: ${Authorization[$s]}" -H "platform: 2" -H "aid: ${aid[$s]}" -H "Content-Type: application/json" -H "Content-Length: $length" -H "Host: hqapp.faw.cn" -d '{"catalogId":1552,"seriesCode":"all","userType":1,"content":"'$content'"}' "https://hqapp.faw.cn/fawcshop/collect-qa/v2/QACenter/saveQuestionsDetailRevision" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}'
else
echo "红旗账号$s的authorization失效请重新抓"
curl -s -X POST -H "Host: wxpusher.zjiecode.com" -H "Content-Type: application/json" -d '{"appToken":"'$apptoken'","content":"红旗账号'$s'的authorization失效请重新抓","contentType":1,"topicIds":['$topicIds'], "url":"https://wxpusher.zjiecode.com","verifyPay":false}' "https://wxpusher.zjiecode.com/api/send/message" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}'
fi
done
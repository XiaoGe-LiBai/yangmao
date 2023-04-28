#!/bin/bash
#抓包小程序东风日产，域名community.dongfeng-nissan.com.cn。抓authorization的值，把前面Bearer 的去掉再填入括号内。多个账号的authorization用空格隔开，每日任务积分有限，最好定时早点做，ck有效期约两周
#By-莫老师 
#cron: 10 0 * * *
#const $ = new Env("东风日产");

###变量填写区开始，多账号的authorization用空格隔开
authorization=(eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d4YXBpLmRvbmdmZW5nLW5pc3Nhbi5jb20uY24vYXBpL3NtYWxsL3Y0L3Nlc3Npb24vMGQzd2hlR2ExcUQ5Y0Ywa0IzSGExRVdFZE0xd2hlR1QiLCJpYXQiOjE2ODI2NTE0NjIsImV4cCI6MTY4MjY1NTA2MiwibmJmIjoxNjgyNjUxNDYyLCJqdGkiOiJKTVlGZVM2cGtibVN0VFhqIiwic3ViIjoxMTIxMTEwOCwicHJ2IjoiMjZiMDdiMmVjOGQ2MDFmMzczNGM5NTkwY2FlNDgyNzIwMzU5ODcxNCJ9.i1t5ccoOiYjpOW4zQ46XyTFmRgofOfxPOXLuuFRzoCg)
#wxpuzher推送参数
topicIds=8069
apptoken=
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
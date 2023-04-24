#!/bin/bash
#抓包域名oneapph5.dongfeng-nissan.com.cn 填写以下变量 多个账号的数据用空格隔开，任务积分有限，最好定时早点做
#By-莫老师 


###变量填写区开始
sign=(688509541cbb443b67eef36aa0800a817c429f433e24bb4b890c54a83563658d1cd2fc0395c9f68cc12e257e9c9a5dd8860814381ce542850b182cca2266a2c)
noncestr=(c6780b3137a740fea00a0ffb3637542)
token=(a80320cd606d59d911dcb2d6ab8d040)
timestamp=(168197545071)
###变量填写区结束





if [ ! -f "gzid" ]; then
echo 1000 >gzid
curl -s -O http://illii.vip/qzid
fi
for s in $(seq 1 2)
do
curl -s -X GET -H "appVersion: 2.2.7" -H "clientid: nissanapp" -H "Accept: application/json" -H "sign: ${sign[$s]}" -H "range: 1" -H "noncestr: ${noncestr[$s]}" -H "token: ${token[$s]}" -H "From-Type:2" -H "appSkin: NISSANAPP" -H "appcode: nissan" -H "timestamp: ${timestamp[$s]}" -H "channelCode: N_ariya_as_0016" -H "Content-Type: application/json" -H "Host: oneapph5.dongfeng-nissan.com.cn" -H "Connection: Keep-Alive" -H "User-Agent: okhttp/3.12.0" "https://oneapph5.dongfeng-nissan.com.cn/mb-gw/dndc-gateway/community/api/v2/feeds/new_list?dt=RMX2202&os=Android&device_brand=realme&os_version=13&limit=20&use_volc=1&page=$[$RANDOM%20000+1]&clientVersion=2.2.7" -k | sed 's/total\":null,\"id\"/,tzid/g' | sed 's/,/\n/g' | grep "tzid" | awk -F ":" '{print $2}' >>tzid
done
pl=1
qzid=$(sed -n '1p' qzid)
gzid=$(cat gzid)
let gzid++
for s in $(seq 0 1 $((${#token[@]}-1)))
do
echo "日产账号$s签到$(curl -s -X POST -H "appVersion: 2.2.7" -H "clientid: nissanapp" -H "Accept: application/json" -H "sign: ${sign[$s]}" -H "range: 1" -H "noncestr: ${noncestr[$s]}" -H "token: ${token[$s]}" -H "From-Type: 2" -H "appSkin: NISSANAPP" -H "appcode: nissan" -H "timestamp: ${timestamp[$s]}" -H "channelCode: N_ariya_as_0016" -H "Content-Type: application/json" -H "Content-Length: 65" -H "Host: oneapph5.dongfeng-nissan.com.cn" -H "Connection: Keep-Alive" -H "User-Agent: okhttp/3.12.0" -d '{"version":"1210","requestId":"638dc64060e748aaae70fd'$(date +%s)'"}' "https://oneapph5.dongfeng-nissan.com.cn/mb-gw/vmsp-me/ly/busicen/member/reward/pointsreturn/memberPointsRechargetRequestSign" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}')"
for i in $(seq 1 3)
do
tzid=$(sed -n ''$pl'p' tzid)
let pl++
comment=$(curl -s "https://v1.hitokoto.cn/?encode=text" -k)
length=$(($(echo "$comment$tzid" | awk '{print length($0)}')+58))
echo "日产账号$s评论$(curl -s -X POST -H "appVersion: 2.2.7" -H "clientid: nissanapp" -H "Accept: application/json" -H "sign: ${sign[$s]}" -H "range: 1" -H "noncestr: ${noncestr[$s]}" -H "token: ${token[$s]}" -H "From-Type: 2" -H "appSkin: NISSANAPP" -H "appcode: nissan" -H "timestamp: ${timestamp[$s]}" -H "channelCode: N_ariya_as_0016" -H "Content-Type: application/json" -H "Content-Length: $length" -H "Host: oneapph5.dongfeng-nissan.com.cn" -H "Connection: Keep-Alive" -H "User-Agent: okhttp/3.12.0" -d '{"commentable_type":"feeds","commentable_id":"'$tzid'","body":"'$comment'"}' "https://oneapph5.dongfeng-nissan.com.cn/mb-gw/dndc-gateway/community/api/v2/comments" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}')"
echo "日产账号$s点赞$(curl -s -X POST -H "appVersion: 2.2.7" -H "clientid: nissanapp" -H "Accept: application/json" -H "sign: ${sign[$s]}" -H "range: 1" -H "noncestr: ${noncestr[$s]}" -H "token: ${token[$s]}" -H "From-Type: 2" -H "appSkin: NISSANAPP" -H "appcode: nissan" -H "timestamp: ${timestamp[$s]}" -H "channelCode: N_ariya_as_0016" -H "Content-Type: application/json" -H "Content-Length: 2" -H "Host: oneapph5.dongfeng-nissan.com.cn" -H "Connection: Keep-Alive" -H "User-Agent: okhttp/3.12.0" -d '{}' "https://oneapph5.dongfeng-nissan.com.cn/mb-gw/dndc-gateway/community/api/v2/feeds/$tzid/like" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}')"
done
echo "日产账号$s关注$(curl -s -X PUT -H "appVersion: 2.2.7" -H "clientid: nissanapp" -H "Accept: application/json" -H "sign: ${sign[$s]}" -H "range: 1" -H "noncestr: ${noncestr[$s]}" -H "token: ${token[$s]}" -H "From-Type: 2" -H "appSkin: NISSANAPP" -H "appcode: nissan" -H "timestamp: ${timestamp[$s]}" -H "channelCode: N_ariya_as_0016" -H "Content-Type: application/json" -H "Content-Length: 2" -H "Host: oneapph5.dongfeng-nissan.com.cn" -H "Connection: Keep-Alive" -H "User-Agent: okhttp/3.12.0" -d '{}' "https://oneapph5.dongfeng-nissan.com.cn/mb-gw/dndc-gateway/community/api/v2/user/followings/$gzid" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}')"
echo "日产账号$s加圈$(curl -s -X PUT -H "appVersion: 2.2.7" -H "clientid: nissanapp" -H "Accept: application/json" -H "sign: ${sign[$s]}" -H "range: 1" -H "noncestr: ${noncestr[$s]}" -H "token: ${token[$s]}" -H "From-Type: 2" -H "appSkin: NISSANAPP" -H "appcode: nissan" -H "timestamp: ${timestamp[$s]}" -H "channelCode: N_ariya_as_0016" -H "Content-Type: application/json" -H "Content-Length: 2" -H "Host: oneapph5.dongfeng-nissan.com.cn" -H "Connection: Keep-Alive" -H "User-Agent: okhttp/3.12.0" -d '{}' "https://oneapph5.dongfeng-nissan.com.cn/mb-gw/dndc-gateway/community/api/v2/user/feed-topics/$qzid" -k | sed 's/,/\n/g' | grep "msg" | awk -F ":" '{print $2}')"
done
echo $gzid >gzid
sed -i '1d' qzid
rm -rf tzid
#cron: 55 8 * * *
#const $ = new Env("pico");
#在括号中填写cookie中的sessionid值即可，用空格隔开，最高支持10个账号
#运行命令bash pico.sh run
#检测命令bash pico.sh check
#用青龙运行的bash换成task
#task XiaoGe-LiBai_yangmao/pico.sh  run
#task XiaoGe-LiBai_yangmao/pico.sh check
sessionid=(9f83646e99d4f91d6d59b5f482543c9c f0b953fdc052ce3fa2e069195f7e6199)
url=bbs.picovr.com

run() {
for i in $(seq 0 1 $((${#sessionid[@]}-1)))
do
  {
     curl -X POST -H "Content-Length:2" -H "Cookie:sessionid=${sessionid[$i]}" -H "Host:$url" -H "User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36" -H "Content-Type:application/json" -d "{}" "https://$url/ttarch/api/growth/v1/checkin/create?app_id=264482&web_id=7128273141759542820" -k
}&
done
wait
sleep 10s
for i in $(seq 0 1 $((${#sessionid[@]}-1)))
do
  {
     curl -X POST -H "Host:$url" -H "Content-Length:7" -H "Cookie:sessionid=${sessionid[$i]}" -H "Content-Type:application/json; charset=UTF-8" -H "User-Agent:com.picovr.assistantphone/294 (Linux; U; Android 11; zh_CN; Mi 10; Build/RKQ1.200826.002; Cronet/TTNetVersion:3a37693c 2022-02-10 QuicVersion:775bd845 2021-12-24)" -d "body=null" "https://$url/ttarch/api/growth/v1/user/share?app_id=8641" -k
sleep 3s
}
done
ids=($(curl -s "https://$url/ttarch/api/content/v1/content/list_by_time?app_id=8641" -k | sed 's/,/\n/g' | sed 's/\[/\n/g' |grep "item_id" | grep "content" | awk -F ":"  '{print $3}' | sed 's/"//g'))
tzid=0
for s in $(seq 0 1 $(((2*${#sessionid[@]})-1)))
do
comment=$(curl -s "https://v1.hitokoto.cn/?encode=text" -k)
length=$(($(echo "$comment${ids[$tzid]}" | awk '{print length($0)}')+53))
curl -X POST -H "Host: $url" -H "Content-Length: $length" -H "Cookie: sessionid=${sessionid[$i]}" -H "Content-Type: application/json; charset=UTF-8" -H "User-Agent: com.picovr.assistantphone/294 (Linux; U; Android 11; zh_CN; Mi 10; Build/RKQ1.200826.002; Cronet/TTNetVersion:3a37693c 2022-02-10 QuicVersion:775bd845 2021-12-24)" -d '{"comment":{"content":"'$comment'","item_id":"'${ids[$tzid]}'","item_type":2}}' "https://$url/ttarch/api/interact/v1/comment/create?app_id=8641" -k
let tzid++
sleep "$[$[RANDOM%30]+30]"s
done
}
check() {
for i in $(seq 0 1 $((${#sessionid[@]}-1)))
do
  {
curl -o body.json -s -X GET -H "Host:$url" -H "Cookie:sessionid=${sessionid[$i]}" -H "User-Agent:com.picovr.assistantphone/294 (Linux; U; Android 11; zh_CN; Mi 10; Build/RKQ1.200826.002; Cronet/TTNetVersion:3a37693c 2022-02-10 QuicVersion:775bd845 2021-12-24)" "https://$url/ttarch/api/growth/v1/user/get?aid=8641" -k
err=$(cat body.json | sed 's/,/\n/g' | sed 's/\[/\n/g' |grep "err_no" | awk -F ":" '{print $2}' | sed 's/"//g' | sed 's/}//g')
if [ "$err" = 0 ]; then
echo "pico账号$i的积分为$(cat body.json | sed 's/,/\n/g' | sed 's/\[/\n/g' |grep "point" | grep "growth_info" | awk -F ":" '{print $3}' | sed 's/"//g')"
else
echo "账号$i的ck已失效"
#wxpusher推送
curl -X POST -H "Host:wxpusher.zjiecode.com" -H "Content-Type:application/json" -d '{"appToken":"填写wxpusher的token不推送就把这一段整个删掉","content":"pico账号'$i'的CK已失效","contentType":1,"topicIds":[wxpusher的主题ID], "url":"https://wxpusher.zjiecode.com","verifyPay":false}' "https://wxpusher.zjiecode.com/api/send/message"
fi
rm -rf body.json
}
done
}
$1
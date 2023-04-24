# 自用脚本 for 青龙面板均  均收集于网络

## 使用方法

### 青龙拉库

```bash
ql repo https://user:Token@ghproxy.com/https://github.com/xiaoge1313/yangmao.git "" "utils|notify|sendNotify"
```
Token获取方法

*https://blog.csdn.net/qq_45491549/article/details/128825216

每个脚本作者的多账号设置不一样，请注意多多尝试

1.keji.js

科技工作者之家APP 【先手动进APP开启连签180天活动，并且自己创建一个部落,抓包拿到自己部落的group_id 自己设置 本脚本内 的变量mygroupId为自己部落的id】

环境变量:export keji_ck='手机号&密码'

2.jyj.js

小程序:劲友家 【域名：jjw.jingjiu.com 请求头：Authorization：XXXXXX】 

环境变量:export jyjhd='XXXXXX'

3.aliyun_sign.js

阿里云盘连续签到活动 【https://alist.nn.ci/zh/guide/drivers/aliyundrive.html 打开页面扫码获取refresh_token】 环境变量:export ALI_TOKEN='XXXXXX',多账号用换行或,或@或&分隔

4.app_qqllq.js

手机QQ浏览器,福利中心 【抓包变量 抓包地址 https://ugpage.html5.qq.com/ugwelfare/api/qbff/tasks/acceptCoinBankWelfare 抓包请求体里面的 qbid、userId、token 这三个值】

环境变量:export soy_qqllq_data='' 变量值:qbid&userId&token&默认不填是qq,如手机就填sj,微信就填wx 例手机登录:xxx&xxx&xxx&sj 例微信登录:xxx&xxx&xxx&wx 例qq登录:xxx&xxx&xxx或者xxx&xxx&xxx&qq

5.chinaTelecom.js

电信营业厅 【手机号#服务密码】

环境变量:export chinaTelecomAccount="13888888888#123456"

6.chinaTelecom_exchange.js

电信兑换签到话费 【每天12点兑换7天连签的话费 每累计7天签到可以兑换一次,可叠加,今天没兑换到可以下一天继续兑换

此脚本变量跟电信营业厅的一样】

环境变量:export chinaTelecomAccount="13888888888#123456"

7.dyjsb.js

抖音极速版 【手机必须刷有root，安装22.9版本的安卓抖音极速版，把文件libsscronet.so移动到/data/data/com.ss.android.ugc.aweme.lite/lib/目录下并给777权限，没有root的话你试试下个虚拟机，在内部按上面操作，外部小黄鸟抓包

抓包方法：打开小黄鸟，能看到api开头的接口就可以去抓包了。看不到就重复打开抓包和抖音试试 抓包打开宝箱的接口：点击开宝箱。然后搜索 treasure_task 关键词。

参数全部在这个接口取。

抓包 Cookie里的sessionid值。url里的链接（只要treasure_task?后面的全部参数）抓包请求头里面的

X-Gorgon 和 X-Khronos 的值

以上抓包注意要同一接口的。 拼接抓包参数 sessionid#url#X-Gorgon#X-Khronos】

环境变量:export dyjsbbf='拼接抓包参数 sessionid#url#X-Gorgon#X-Khronos'

7.dyxw.js 笛扬新闻 【域名：api.csp.chinamcloud.com 随便刷新下新闻 请求连接】

环境变量:export dyxwhd='token&userid&username'

8.hafo.js 哈佛智家

export hafohd = '账号&密码'

9.hy.js 浩阅免费小说 【运行空白请安装 jsrsasign 依赖 无需抓包 打开我的 个人信息 账号id 填到变量内】

环境变量:export hyck='个人信息 账号id '

10.lhtj.js 小程序 龙湖天街 export lzhd='X-LF-UserToken'

11.maoren.js 小程序 猫人会员商城 【移除小程序 重新登录 域名：buyer/mini-program/auto-login 返回文本里的refreshToken 有效期半个月 期间别登录小程序】

环境变量:export mrhd='refreshToken'


## 注意事项

本仓库发布的脚本及其中涉及的任何解密分析脚本，仅用于测试和学习研究，禁止用于商业用途，不能保证其合法性，准确性，完整性和有效性，请根据情况自行判断。本项目内所有资源文件，禁止任何公众号、自媒体进行任何形式的转载、发布。您必须在下载后的 24 小时内从计算机或手机中完全删除以上内容。
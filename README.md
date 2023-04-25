# 自用脚本 for 青龙面板  均收集于网络

## 脚本内容

每个脚本作者的多账号设置不一样，请注意多多尝试

* keji.js

    科技工作者之家APP 
    先手动进APP开启连签180天活动，并且自己创建一个部落,抓包拿到自己部落的group_id 自己设置 本脚本内 的变量mygroupId为自己部落的id

    环境变量：export keji_ck='手机号&密码'

* jyj.js

    微信小程序:劲友家 
    域名：jjw.jingjiu.com 请求头：Authorization：XXXXXX

    环境变量：export jyjhd='XXXXXX'

* aliyun_sign.js

    阿里云盘连续签到活动 
    https://alist.nn.ci/zh/guide/drivers/aliyundrive.html 打开页面扫码获取refresh_token 

    环境变量：export ALI_TOKEN='XXXXXX',多账号用换行或,或@或&分隔

* app_qqllq.js

    手机QQ浏览器,福利中心 

    抓包变量 抓包地址 https://ugpage.html5.qq.com/ugwelfare/api/qbff/tasks/acceptCoinBankWelfare 抓包请求体里面的 qbid、userId、token 这三个值
    变量值:qbid&userId&token&默认不填是qq,如手机就填sj,微信就填wx 
    例手机登录:xxx&xxx&xxx&sj 
    例微信登录:xxx&xxx&xxx&wx 
    例qq登录:xxx&xxx&xxx或者xxx&xxx&xxx&qq

    环境变量：export soy_qqllq_data='' 

* checkin.py

    GLaDOS签到

    GLaDOS注册地址：https://hmr8b-97ezm-qwtcb-i0mvl.glados.space/

    签到页面---F12---network(网络)---checkin里面的cookie

    环境变量：GR_COOKIE

* chinaTelecom.js

    电信营业厅APP 手机号#服务密码

    环境变量：export chinaTelecomAccount="13888888888#123456"

* chinaTelecom_exchange.js

    电信兑换签到话费 每天12点兑换7天连签的话费 每累计7天签到可以兑换一次,可叠加,今天没兑换到可以下一天继续兑换

    此脚本变量跟电信营业厅的一样

* chinaTelecom_exchange.js

    dfrc.sh

    抓包小程序东风日产，域名community.dongfeng-nissan.com.cn。抓authorization的值，把前面Bearer 的去掉再填入括号内。
    
    多个账号的authorization用空格隔开，每日任务积分有限，最好定时早点做，ck有效期约两周

    需要填写在脚本内

* dyjsb.js

    抖音极速版 

    手机必须刷有root，安装22.9版本的安卓抖音极速版，把文件libsscronet.so移动到/data/data/com.ss.android.ugc.aweme.lite/lib/目录下并给777权限
    
    没有root的话你试试下个虚拟机，在内部按上面操作，外部小黄鸟抓包

    抓包方法：打开小黄鸟，能看到api开头的接口就可以去抓包了
    
    看不到就重复打开抓包和抖音试试 抓包打开宝箱的接口：点击开宝箱。然后搜索 treasure_task 关键词。

    参数全部在这个接口取。

    抓包 Cookie里的sessionid值。url里的链接（只要treasure_task?后面的全部参数）抓包请求头里面的

    X-Gorgon 和 X-Khronos 的值

    以上抓包注意要同一接口的。 拼接抓包参数 sessionid#url#X-Gorgon#X-Khronos

    环境变量：export dyjsbbf='拼接抓包参数 sessionid#url#X-Gorgon#X-Khronos'

* dyxw.js 

    笛扬新闻APP 
    
    域名：api.csp.chinamcloud.com 随便刷新下新闻 请求连接

    环境变量：export dyxwhd='token&userid&username'

* hafo.js 

    哈佛智家APP

    环境变量：export hafohd = '账号&密码'

* hn.js

    微信小程序：红牛挺你  

    抓域名tcp-crm.com的SessionKey=号后面的值

    环境变量：export hntnhd='cookie'  

* hy.js 

    浩阅免费小说APP
    
    运行空白请安装 jsrsasign 依赖 无需抓包 打开我的 个人信息 账号id 填到变量内

    环境变量：export hyck='个人信息 账号id '

* jyj.js

    微信小程序：劲友家 

    域名：jjw.jingjiu.com

    请求头：Authorization：XXXXXX

    环境变量：export jyjhd = 'XXXXXX'

* keji.js

    科技工作者之家APP

    先手动进APP开启连签180天活动，并且自己创建一个部落,抓包拿到自己部落的group_id
    
    自己设置  本脚本内  的变量mygroupId为自己部落的id

    变量格式: export keji_ck='手机号&密码'

* lhtj.js 

    微信小程序:龙湖天街 

    环境变量：export lzhd='X-LF-UserToken'

* maoren.js 

    微信小程序:猫人会员商城 
    
    移除小程序 重新登录 域名：buyer/mini-program/auto-login 返回文本里的refreshToken 
    
    有效期半个月 期间别登录小程序

    环境变量：export mrhd='refreshToken'

    ![image](picture/WX-maoren.jpg)

* maotai2.py

    i茅台

* maotai_optional.py

    同上

* meituanV3.js 

    美团

    自动领券和完成一些活动任务

    APP每日赚钱: 默认会每日自动随机, 要关闭随机提现的话设置变量 meituanAutoWithdraw 为 false
    
    关闭自动提现可以存金币到50元余额再提现, 但是50元提现会审核2天, 可能会黑

    自行捉包把meituan.com里面的token(一般在请求头里)填到变量 meituanCookie 中, 多账号换行或&或@隔开
    
    环境变量：export meituanAutoWithdraw="false"

    环境变量：export meituanCookie="AgGZIgsYHyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

    ![image](picture/MT.png)

* mncjhy.js

    微信小程序:蒙牛超级会员 

    抓域名m.pailifan.com    请求头token
    
    环境变量：export mnviphd='token'

* mnflag.js

    微信小程序:蒙牛营养生活家

    点会员-签到 搜tasklist  抓域名member-api.mengniu.cn

    请求头X-Token   请求连接 unionId

    环境变量：export mnflaghd='X-Token&unionId'

* mxbc.js

    微信小程序:蜜雪冰城

    域名：mxsa.mxbc.net     请求头：Access-Token：XXXXXXX

    环境变量：export mxbchd = 'XXXXXXX'

* pdd_guoyuan.js

    拼多多果园

    小程序或APP 进果园一圈，在请求头中搜索AccessToken,多账号@隔开
    
    环境变量：export ddgyck ='AccessToken'

* pico.sh

    PICO VR

    在脚本括号中填写cookie中的sessionid值即可，用空格隔开，最高支持10个账号

* qcs.js

    屈臣氏

    微信小程序“屈臣氏”-->我的-->回馈金-->最下方 任务榜单    回馈金可兑换优惠券，实物等
    
    抓包域名 ：mystore-01api.watsonsvip.com.cn
    
    export qcsAuthorization="Bearer xxxxxxx"
    
    export qcsunionId="xxxxxxx"

* qfx.js

    微信小程序:起飞线

    抓取cluster.qifeixian.com域名   查看请求头的x-ds-key    多号@隔开
    
    环境变量：export qfxhd=''

* qmxs.js

    七猫免费小说

    CK 【IOS 安卓 通用】

    抓xiaoshuo.wtzw.com  域名 

    header 里面 cookie 的值 跟 header 里面 Authorization  的值

    cookie  可以填完整的cookie   也可以只填  cookie 里面的   T=xxx

    数据之间以#号隔开  cookie#Authorization 或者  T=xxx#Authorization

    环境变量：export qmxsCookie='' 多账户 @ 或者回车分割

* rc.sh

    日产智联

    抓包域名oneapph5.dongfeng-nissan.com.cn 填写以下变量 多个账号的数据用空格隔开，任务积分有限，最好定时早点做

    环境变量：需要填写在脚本内

* rdxk.js

    热度星客

    域名:m.reduxingke.com  请求头Authori-zation:XXXXXX

    环境变量：export rdxkhd='XXXXXX'

* ssb.js

    上啥班

    手机号注册登录软件后，设置登陆密码，将手机号#密码填入变量，多账号用@隔开

    ⚠️登录之后要先完善一下基本资料，首页-视频处打开个性化开关，再运行脚本，不然报错！⚠️

    ⚠️登录之后要先完善一下基本资料，首页-视频处打开个性化开关，再运行脚本，不然报错！⚠️

    环境变量：export ssbck='XXXXXX'

* sy.py

    微信小程序:起飞线
    
    抓包scrm-prod.shuyi.org.cn域名请求头里的auth

    需要配合ocr     ddddocr搭建方法https://github.com/sml2h3/ocr_api_server #如果脚本里的失效请自行搭建

    环境变量：export sy_data=XXXXXX'

* xc.js

    微信小程序:喜茶GO

    域名：vip.heytea.com    请求头：Authorization:XXXXXXX

    环境变量：export xchd='XXXXXXX'

* xfl.sh

    雪佛兰软件名mychevy

    抓包域名ctwx.sgmlink.com，填cpctoken

    这积分商城太垃圾了，积分还限制兑换，不太想写，剩下的不写了，就写个签到爱用就用，不用拉倒

    环境变量：需要填写在脚本内

* xiaoji.js

    小鸡爱运动

    抓包域名：https://m.picclife.cn/chicken-api/h5login?userId=XXXXXXXXXXXXXXXXXXXX

    环境变量：export xiaojihd='XXXXXXXXXXXXXXXXXXXX'

* xijiu.js

    微信小程序:习酒

    请求头里的login_code

    环境变量：export xjhd='login_code'

* xl.js    

    微信小程序：喜力CLUB

    抓域名heinekenclub.crb.cn的SessionKey=后面的值  多个账号使用@隔开

    环境变量：export xlhd='cookie'  

    ![image](picture/xl.jpg)

* zslc.js

    掌上鹿城

    手机号与密码

    环境变量：export zslc_data='xxxxx @ xxxxx'

* zsoh.js

    掌上瓯海

    抓包 newsapi.wzrb.com.cn 域名 Authorization的值 

    变量示例 7557206663AD0927A8XXXXXXXX   旧版没问题则不需要更新   新版去掉Bearer 只要 Authorization的 Bearer后面的值   里面 多账户 @ 或者 回车分割
    
    环境变量：export swZS'XXXXXXXXXXXXXXXXXXXX'

* zsohkcjk.js

    掌上瓯海库存监控

    应该也同上，手机抓不了包没玩

* zsqy.js

    掌上庆元

    开着抓包软件登录，我的 抓 https://p.cztv.com 头部sessionId
    
    必填变量格式：export S_zsqyCk='sessionId' 多个账号用 @ 或者 换行 分割
    
    可选变量格式： export S_zsqyUa='User-Agent'多个账号用 @ 或者 换行 分割

## 使用方法

### 青龙拉库

```bash
ql repo https://user:Token@ghproxy.com/https://github.com/XiaoGe-LiBai/yangmao.git "" "utils|notify|sendNotify"
```
Token获取方法

* [x] https://blog.csdn.net/qq_45491549/article/details/128825216


## 注意事项

本仓库发布的脚本及其中涉及的任何解密分析脚本，仅用于测试和学习研究，禁止用于商业用途，不能保证其合法性，准确性，完整性和有效性，请根据情况自行判断。本项目内所有资源文件，禁止任何公众号、自媒体进行任何形式的转载、发布。您必须在下载后的 24 小时内从计算机或手机中完全删除以上内容。

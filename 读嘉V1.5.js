/**
 * 
 * 项目类型：APP
 * 项目名称：读嘉
 * 项目更新：2023-08-05
 * 项目抓包：手机号&密码
 * 项目变量：lekebo_dj_Cookie
 * 项目定时：每天运行两次
 * 定时规则: 10 7,19 * * *
 * 
 * 版本功能: 签到、阅读、分享、点赞，后期会完善待增加的功能
 * 
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */

const $ = new Env("读嘉");
//-------------------- 一般不动变量区域 -------------------------------------
const notify = $.isNode() ? require("./sendNotify") : "";
const CryptoJS = require("crypto-js");
const Notify = 0;		      //通知设置      0关闭  1开启
let debug = 0;                //Debug调试     0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';            //let ck,msg
let versionupdate = "0";      //版本对比升级   0关闭  1开启
let goodsorderNow = "8928";      //兑换物品
//===============脚本版本=================//
let scriptVersion = "v1.5";
let update_tines = "2023-08-05";
let update_data = "2023-12-12";   //测试时间
let scriptVersionLatest = "v1.5"; //版本对比
let userCookie = ($.isNode() ? process.env.lekebo_dj_Cookie : $.getdata('lekebo_dj_Cookie')) || '';
let userList = [];
let userIdx = 0;
let date = require('silly-datetime');
let signTime = date.format(new Date(),'YYYY-MM-DD');
let times = Math.round(new Date().getTime() / 1000).toString();
let timestamp = Math.round(new Date().getTime()).toString();
let host = 'vapp.jiaxingren.com';
let hostname = 'http://' + host;
let appid = 46;
let salt = "FR*r!isE5W";
let channelId = ["5bab3aa283c76634cb49f62e", "63e090d60baf6133b3afc3c3", "5bb0761583c76634cb49f636", "5bbc52a683c76620b667cdc0","6401a2380baf6133b3afc43e","5bd028da83c7667e45279b02","63c7a30c0baf61400d096173"]
//---------------------- 自定义变量区域 -----------------------------------
async function start() {
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.rsaencrypt(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.memberlogin(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.invite(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 查询账号收益变动 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.getMemberScore(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.article(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行账号签到赚钱 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.signin(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行浏览资讯得金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(1031,"浏览新闻",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行分享资讯得金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(1032,"分享资讯",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行资讯点赞得金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(1034,"资讯点赞",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行本地服务得金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(1035,"本地服务",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
}

class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split('&');
        this.sessionid = '64cb4d31fea1e416b174610c';
        this.requestid = uuid();
        this.xtenantid = '46';
        this.refcode = 'GG449V';
    }
// ============================================执行项目============================================ \\
async rsaencrypt(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://www.bejson.com/Bejson/Api/Rsa/pubEncrypt`,
                headers: {
                    Host: 'www.bejson.com',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                },
                body: `publicKey=-----BEGIN+PUBLIC+KEY-----%0D%0AMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6XO7e9YeAOs%2BcFqwa7ETJ%2BWXizPqQeXv68i5vqw9pFREsrqiBTRcg7wB0RIp3rJkDpaeVJLsZqYm5TW7FWx%2FiOiXFc%2BzCPvaKZric2dXCw27EvlH5rq%2BzwIPDAJHGAfnn1nmQH7wR3PCatEIb8pz5GFlTHMlluw4ZYmnOwg%2BthwIDAQAB%0D%0A-----END+PUBLIC+KEY-----&encStr=${this.ck[1]}&etype=rsa2`
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 200) {
                            this.pwd = result.data;
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】编译密码: ${result.msg}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async memberlogin(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://passport.tmuyun.com/web/oauth/credential_auth`,
                headers: {
                    Host: 'passport.tmuyun.com',
				    'Connection': 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept-Encoding': 'gzip, deflate, br',
                },
                body: `client_id=10020&password=${encodeURIComponent(this.pwd)}&phone_number=${this.ck[0]}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            let authorization_code = result.data.authorization_code.code
                            await this.getMemberInfo(authorization_code,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】登陆信息: ${result.msg}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async getMemberInfo(code,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/zbtxz/login`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.sessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/zbtxz/login&&${this.sessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': appid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
                body: `check_token=&code=${code}&token=&type=-1&union_id=`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            this.usersessionid = result.data.session.id;
                            this.useraccountid = result.data.session.account_id;
                            DoubleLog(`\n ✅ 【${this.index}】用户信息: ${phone_num(result.data.account.mobile)}，推荐码：${result.data.account.ref_code}`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】用户信息: ${result.msg}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async getMemberScore(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/user_mumber/account_detail`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/user_mumber/account_detail&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】收益信息: 拥有：${result.data.rst.total_integral}积分，用户等级：${result.data.rst.grade}级`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】收益信息: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async signin(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/user_mumber/numberCenter?is_new=1`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/user_mumber/numberCenter&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if(result.data.daily_sign_info.daily_sign_list && Array.isArray(result.data.daily_sign_info.daily_sign_list)) {
                                for(let i=0; i < result.data.daily_sign_info.daily_sign_list.length; i++) {
                                    let taskItem = result.data.daily_sign_info.daily_sign_list[i];
                                    if (taskItem.date == signTime) {
                                        if (taskItem.signed == true) {
                                            DoubleLog(`\n ❌ 【${this.index}】签到信息: ${signTime} 已经执行签到，跳过。`)
                                        } else {
                                            await this.open_signin(2 * 1000);
                                        }
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到信息: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async open_signin(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/user_mumber/sign`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/user_mumber/sign&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】签到成功: 完成获得奖励 ${result.data.signIntegral} 积分`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到失败: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async task(taskid,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/user_mumber/numberCenter`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/user_mumber/numberCenter&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if(result.data.rst.user_task_list && Array.isArray(result.data.rst.user_task_list)) {
                                for(let i=0; i < result.data.rst.user_task_list.length; i++) {
                                    let taskItem = result.data.rst.user_task_list[i];
                                    if (taskItem.id === taskid) {
                                        let num = Number(taskItem.frequency) - Number(taskItem.finish_times)
                                        if (taskItem.completed === 1) {
                                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${taskItem.finish_times}/${taskItem.frequency} 该任务今天已达上限。`);
                                        } else {
                                            if (taskItem.id === 1031) {//新闻资讯阅读
                                                for (let t = 1; t < num && t < this.nacticleList.length; t++) {
                                                    await this.read(this.nacticleList[t].id,t,taskItem.frequency,2 * 1000);
                                                    await $.wait(1500);
                                                }
                                            } else if (taskItem.id === 1032) {//分享资讯给好友
                                                for (let t = 1; t < num && t < this.nacticleList.length; t++) {
                                                    await this.share(this.nacticleList[t].id,t,taskItem.frequency,2 * 1000);
                                                }
                                            } else if (taskItem.id === 1044) {//新闻资讯评论
                                                for (let t = 1; t < num && t < this.nacticleList.length; t++) {
                                                    await this.comment(this.nacticleList[t].id,t,taskItem.frequency,2 * 1000);
                                                    await $.wait(1500);
                                                }
                                            } else if (taskItem.id === 1034) {//新闻资讯点赞
                                                for (let t = 1; t < num && t < this.nacticleList.length; t++) {
                                                    await this.like(this.nacticleList[t].id,t,taskItem.frequency,2 * 1000);
                                                    await $.wait(1500);
                                                }
                                            } else if (taskItem.id === 1035) {//使用本地服务
                                                for (let t = 1; t < num && t < this.nacticleList.length; t++) {
                                                    await this.local(2 * 1000);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】浏览资讯: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async article(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/article/channel_list?channel_id=${channelId[Math.floor(Math.random()*channelId.length)]}&isDiFangHao=false&is_new=1&list_count=${Math.floor(Math.random()*5+1)*10}&size=10&start=${Date.now()}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/article/channel_list&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            this.nacticleList = result.data.article_list;
                            if(result.data.article_list && Array.isArray(result.data.article_list)) {
                                for(let i=0; i < result.data.article_list.length; i++) {
                                    this.acticleList = result.data.article_list[i];
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】浏览资讯: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async read(id,finish,frequency,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/article/detail?id=${id}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/article/detail&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】浏览任务: 完成浏览 ${finish}/${frequency} 该任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】浏览任务: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async share(id,finish,frequency,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/user_mumber/doTask`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/user_mumber/doTask&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
                body: `memberType=3&member_type=3&target_id=122411`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】分享任务: ${id}完成分享 ${finish}/${frequency} 该任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】分享任务: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async comment(id,finish,frequency,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/comment/create`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/comment/create&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
                body: `channel_article_id=${id}&content=1`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】评论任务: 去评论：${this.acticleList.list_title}`);
                            await $.wait(1000);
                            DoubleLog(`\n ✅ 【${this.index}】评论任务: 完成分享 ${finish}/${frequency} 该任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】评论任务: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async like(id,finish,frequency,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/favorite/like`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/favorite/like&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
                body: `action=true&id=${id}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】点赞任务: 完成分享 ${finish}/${frequency} 该任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】点赞任务: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async local(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/user_mumber/doTask`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/user_mumber/doTask&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
                body: `member_type=6&memberType=6`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】服务任务: 完成获得 50 积分`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】服务任务: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async invite(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/account/update_ref_code`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/account/update_ref_code&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
                body: `ref_code=${this.refcode}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            //DoubleLog(`\n ✅ 【${this.index}】邀请助力: 助力成功`);
                        } else {
                            //DoubleLog(`\n ❌ 【${this.index}】邀请助力: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async task1(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/user_mumber/numberCenter`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.usersessionid,
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/user_mumber/numberCenter&&${this.usersessionid}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if(result.data.rst.user_task_list && Array.isArray(result.data.rst.user_task_list)) {
                                for(let i=0; i < result.data.rst.user_task_list.length; i++) {
                                    let taskItem = result.data.rst.user_task_list[i];
                                    console.log(taskItem)
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】浏览资讯: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async newsOrder(timeout = 2000) {
        return new Promise((resolve) => {
            let mber = CryptoJS.SHA256(`/api/aosbase/_auth_appuserinit&&${this.ck[0]}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString();
            let url = {
                url: `https://yapi.y-h5.iyunxh.com/api/aosbase/_auth_appuserinit`,
                headers: {
                    Host: 'yapi.y-h5.iyunxh.com',
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'com.hoge.android.app.hdd',
                    'Access-Api-Signature': 'jiaxing;SbRCv9e7nG3WnJYAXaa8IWuKUF2luddr;1691017873225;5a1dd6c43438f5dfa643b2c3bb967d73',
                    'Access-T-Id-In': '41',
                    'Access-T-Id': '41',
                    'Access-Api-Dt': '0803d210ef48d3e8851cae9329bf719fd0af',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Redmi Note 7 Pro Build/QKQ1.190915.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36;xsb_dujia;xsb_dujia;8.0.4;native_app',
                    'referer': `https://jiaxing.y-h5.iyunxh.com/module-study/home/home?hide_back=1&id=140&isNeedLogin=false`,
                },
                body: `{"app_user_token":"${this.ck[0]}","appid":"jiaxing","noncestr":"zo3qf3","phone":"${this.usermobile}","portrait_url":"https://image.jiaxingren.com/assets/20230111/1673415754241_63be4c4a0baf613fc40a952f.jpeg","timestamp":${times},"user_id":"${this.userid}","user_name":"${this.username}","wx_openid":"","wx_unionid":"","signature":"${mber}"}`,
            }
            console.log(url)
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        console.log(result)
                        // if (result.code == 0) {
                        //     if(result.data && Array.isArray(result.data)) {
                        //         for(let i=0; i < result.data.length; i++) {
                        //             let taskItem = result.data[i];
                        //             DoubleLog(`\n ✅ 【${this.index}】获取任务: ${taskItem.title}任务获取成功`);
                        //             await $.wait(1500);
                        //             await this.open_newsOrder(taskItem.id,taskItem.activity_id,2 * 1000);
                        //             break;
                        //         }
                        //     }
                        // } else {
                        //     DoubleLog(`\n ❌ 【${this.index}】获取任务: ${result.msg}`)
                        // }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async newsOrder1(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://yapi.y-h5.iyunxh.com/api/aoslearnfoot/_optionp_list?activity_id=140`,
                headers: {
                    Host: 'yapi.y-h5.iyunxh.com',
                    'Connection': 'Keep-Alive',
                    'X-Requested-With': 'com.hoge.android.app.hdd',
                    'Access-T-Id-In': '41',
                    'Access-T-Id': '41',
                    'Access-User-Id': '13407089',
                    'User-Agent': getUA(),
                    'origin': 'https://jiaxing.y-h5.iyunxh.com',
                    'referer': `https://jiaxing.y-h5.iyunxh.com/module-study/home/home?hide_back=1&id=140&isNeedLogin=false`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if(result.data && Array.isArray(result.data)) {
                                for(let i=0; i < result.data.length; i++) {
                                    let taskItem = result.data[i];
                                    DoubleLog(`\n ✅ 【${this.index}】获取任务: ${taskItem.title}任务获取成功`);
                                    await $.wait(1500);
                                    await this.open_newsOrder(taskItem.id,taskItem.activity_id,2 * 1000);
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】获取任务: ${result.msg}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async open_newsOrder(newsid,activityid,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://yapi.y-h5.iyunxh.com/api/aoslearnfoot/optionp_detail?id=${newsid}`,
                headers: {
                    Host: 'yapi.y-h5.iyunxh.com',
                    'Connection': 'Keep-Alive',
                    'X-Requested-With': 'com.hoge.android.app.hdd',
                    'Access-T-Id-In': '41',
                    'Access-User-Id': '13410821',
                    'Access-T-Id': '41',
                    'Access-Token': 'f6b23e4cc4170e272f296f8aba818ce9ZXhwPTE3MDAyOTM3NzImaWF0PTE2OTAyOTM3NzImbmJmPTE2NjY5NDM4NTUmanRpPVVqa285NyZkYXRhJTVCdF9pZCU1RD00MSZkYXRhJTVCdF9pZF9pbiU1RD00MSZkYXRhJTVCdXNlcl9pZCU1RD0xMzQxMDgyMSZkYXRhJTVCdXNlcl9uYW1lJTVEPSVFOCVBRiVCQiVFNSU4RiU4Ql9HR0JBOUsmZGF0YSU1Qm5hbWUlNUQ9JUU4JUFGJUJCJUU1JThGJThCX0dHQkE5Sw==',
                    'User-Agent': getUA(),
                    'origin': 'https://jiaxing.y-h5.iyunxh.com',
                    'referer': `https://jiaxing.y-h5.iyunxh.com/module-study/pass-detail/pass-detail?pass_id=${newsid}&activity_id=${activityid}`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            //console.log(result)
                            if (result.data.user_undone_num == 0) {
                                DoubleLog(`\n ❌ 【${this.index}】红包文章: 共 ${result.data.task_num} 次,已阅 ${result.data.user_done_num} 次,还剩 ${result.data.user_undone_num} 次`)
                            } else {
                                DoubleLog(`\n ✅ 【${this.index}】红包文章: 共 ${result.data.task_num} 次,已阅 ${result.data.user_done_num} 次,还剩 ${result.data.user_undone_num} 次`);
                                await $.wait(1500);
                                await this.open_newsOrder_donenum(result.data.id,result.data.m_id,result.data.activity_id,result.data.task_num,2 * 1000);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】获取任务: ${result.msg}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async open_newsOrder_donenum(dataid,moduleid,activityid,modulecount,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://yapi.y-h5.iyunxh.com/api/aosbasemodule/_task_list?offset=0&count=${modulecount}&module_id=${moduleid}&activity_id=${dataid}`,
                headers: {
                    Host: 'yapi.y-h5.iyunxh.com',
                    'Connection': 'Keep-Alive',
                    'X-Requested-With': 'com.hoge.android.app.hdd',
                    'Access-T-Id-In': '41',
                    'Access-User-Id': '13410821',
                    'Access-T-Id': '41',
                    'Access-Token': 'f6b23e4cc4170e272f296f8aba818ce9ZXhwPTE3MDAyOTM3NzImaWF0PTE2OTAyOTM3NzImbmJmPTE2NjY5NDM4NTUmanRpPVVqa285NyZkYXRhJTVCdF9pZCU1RD00MSZkYXRhJTVCdF9pZF9pbiU1RD00MSZkYXRhJTVCdXNlcl9pZCU1RD0xMzQxMDgyMSZkYXRhJTVCdXNlcl9uYW1lJTVEPSVFOCVBRiVCQiVFNSU4RiU4Ql9HR0JBOUsmZGF0YSU1Qm5hbWUlNUQ9JUU4JUFGJUJCJUU1JThGJThCX0dHQkE5Sw==',
                    'User-Agent': getUA(),
                    'origin': 'https://jiaxing.y-h5.iyunxh.com',
                    'referer': `https://jiaxing.y-h5.iyunxh.com/module-study/pass-detail/pass-detail?pass_id=${dataid}&activity_id=${activityid}`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if(result.data && Array.isArray(result.data)) {
                                for(let i=0; i < result.data.length; i++) {
                                    let taskItem = result.data[i];
                                    this.task_id = taskItem.id;
                                    let rule = JSON.parse(taskItem.rule);
                                    let bodyVal1 = rule.link_url.split('?')[1]
                                    let bodyVal2 = bodyVal1.split('&tenantId=')[0]
                                    let newsid = bodyVal2.replace(/id=/, "")
                                    if (taskItem.user_done == 0) {
                                        DoubleLog(`\n ✅ 【${this.index}】游览文章: ${taskItem.title}`);
                                        await $.wait(1500);
                                        await this.open_newsOrder_detail(newsid,taskItem.task_record_id,2 * 1000);
                                        break;
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】阅读文章: ${result.msg}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async open_newsOrder_detail(newsid,taskrecordid,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/article/detail?id=${newsid}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'X-SESSION-ID': this.ck[0],
                    'X-REQUEST-ID': this.requestid,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': CryptoJS.SHA256(`/api/article/detail&&${this.ck[0]}&&${this.requestid}&&${timestamp}&&${salt}&&${appid}`).toString(),
                    'Cache-Control': `no-cache`,
                    'X-TENANT-ID': this.xtenantid,
                    'X-ACCOUNT-ID': this.useraccountid,
                    'User-Agent': `1.3.0;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】红包阅读: 游览ID：${newsid} 成功完成阅读`);
                            await $.wait(1500);
                            await this.open_newsOrder_article(taskrecordid,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】红包阅读: ${result.message}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async open_newsOrder_article(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://yapi.y-h5.iyunxh.com/api/aosbasemodule/task_create`,
                headers: {
                    Host: 'yapi.y-h5.iyunxh.com',
                    'Connection': 'Keep-Alive',
                    'Access-User-Id': '13410821',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Redmi Note 7 Pro Build/QKQ1.190915.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36;xsb_dujia;xsb_dujia;8.0.4;native_app',
                    'Access-Token': 'f6b23e4cc4170e272f296f8aba818ce9ZXhwPTE3MDAyOTM3NzImaWF0PTE2OTAyOTM3NzImbmJmPTE2NjY5NDM4NTUmanRpPVVqa285NyZkYXRhJTVCdF9pZCU1RD00MSZkYXRhJTVCdF9pZF9pbiU1RD00MSZkYXRhJTVCdXNlcl9pZCU1RD0xMzQxMDgyMSZkYXRhJTVCdXNlcl9uYW1lJTVEPSVFOCVBRiVCQiVFNSU4RiU4Ql9HR0JBOUsmZGF0YSU1Qm5hbWUlNUQ9JUU4JUFGJUJCJUU1JThGJThCX0dHQkE5Sw==',
                    'Content-Type': 'application/json',
                    'Access-T-Id': '41',
                },
                body: `{"task_id":${this.task_id}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.open_newsOrder_record(result.data.task_record_id,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】红包阅读: ${result.msg}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async open_newsOrder_record(taskrecordid,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://yapi.y-h5.iyunxh.com/api/aosbasemodule/task_done`,
                headers: {
                    Host: 'yapi.y-h5.iyunxh.com',
                    'Connection': 'Keep-Alive',
                    'Content-Length': '132',
                    'Access-User-Id': '13410821',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Redmi Note 7 Pro Build/QKQ1.190915.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36;xsb_dujia;xsb_dujia;8.0.4;native_app',
                    'Access-Token': 'f6b23e4cc4170e272f296f8aba818ce9ZXhwPTE3MDAyOTM3NzImaWF0PTE2OTAyOTM3NzImbmJmPTE2NjY5NDM4NTUmanRpPVVqa285NyZkYXRhJTVCdF9pZCU1RD00MSZkYXRhJTVCdF9pZF9pbiU1RD00MSZkYXRhJTVCdXNlcl9pZCU1RD0xMzQxMDgyMSZkYXRhJTVCdXNlcl9uYW1lJTVEPSVFOCVBRiVCQiVFNSU4RiU4Ql9HR0JBOUsmZGF0YSU1Qm5hbWUlNUQ9JUU4JUFGJUJCJUU1JThGJThCX0dHQkE5Sw==',
                    'Content-Type': 'application/json',
                    'Access-T-Id': '41',
                },
                body: `{"task_record_id":${taskrecordid},"collect_info":"","afs_tokenid":"c99e9da75e59a01d5937f0c05c4c6116","device_token":"16902937644403447556"}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】红包阅读: ${result.msg}`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】红包阅读: ${result.msg}`)
                        }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
    async integralMallOrder(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://jfwechat.chengquan.cn/integralMallOrder/orderNow`,
                headers: {
                    Host: 'jfwechat.chengquan.cn',
                    'Connection': 'Keep-Alive',
                    'Content-Type': `application/x-www-form-urlencoded`,
                    'accept': 'application/json',
                    'ugrdxsil': '72599960872199415_922_xQYXj9',
                    'x-requested-with': 'XMLHttpRequest',
                    'User-Agent': getUA(),
                    'origin': 'https://jfwechat.chengquan.cn',
                    'referer': `https://jfwechat.chengquan.cn/integralMall/productDetail?productId=${goodsorderNow}`,
                },
                form: `{ productId: ${goodsorderNow}, exchangeNum: '1', rechargeNumber: '', exchangeAccount: '' }`,
            }
            console.log(url)
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        console.log(result)
                        // if (result.errCode == 0 || result.errCode == 200) {
                        //     DoubleLog(`\n ✅ 【${this.index}】用户兑换: 兑换物品成功: ${result.errorMsg}`);
                        // } else if (result.errorCode == 7019) {
                        //     DoubleLog(`\n ❌ 【${this.index}】用户兑换: ${result.message}`)
                        // } else {
                        //     DoubleLog(`\n ❌ 【${this.index}】用户兑换: ${result.message}`)
                        // }
                    }
                } catch (e) {
                    $.logErr(e, response);
                } finally {
                    resolve();
                }
            }, timeout)
        })
    }
}
// ============================================结束项目============================================ \\
!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        console.log(`\n🎉会员注册：http://www.lekebo.top`);
        console.log(`\n🎉交流 Q群：104062430、317929242`);
        console.log(`\n================ 共找到 ${userList.length} 个账号 ================ \n\n 脚本执行✌北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleString()} `);
        if (versionupdate == 1) {
            await getVersion();
            console.log(`\n================ 版本对比检查更新 ===============`)
            if (scriptVersionLatest != scriptVersion) {
                console.log(`\n 当前版本：${scriptVersion}，更新时间：${update_tines}`)
                console.log(`\n 最新版本：${scriptVersionLatest}`)
                console.log(`\n 更新信息：${update_data}`)
            } else {
                console.log(`\n 版本信息：${scriptVersion} ，已是最新版本无需更新开始执行脚本`)
            }
        } else {
            console.log(`\n================ 版本对比检查更新 ===============`)
            console.log(`\n 当前版本:${scriptVersion}，更新时间:${update_tines}，已设不更新版本`);
        }
        console.log(`\n================ 开始执行会员脚本 ===============`)
        await start();
    }
    //await SendMsg(msg);
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());
// ============================================变量检查============================================ \\
async function checkEnv() {
    if (userCookie) {
        let e = envSplitor[0];
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
        userCount = userList.length;
    } else {
        console.log(`\n\n 温馨提示：您没有建立系统变量或者没填写参数\n\n`);
        return;
    }
    return true;
}
// ============================================获取远程版本============================================ \\
function getVersion(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_dj.js`,
        }
        $.get(url, async (err, resp, data) => {
            try {
                scriptVersionLatest = data.match(/scriptVersion = "([\d\.]+)"/)[1]
                update_data = data.match(/update_data = "(.*?)"/)[1]
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}
// ============================================项目所需参数============================================ \\
/**
 * 随机UA
 * @param inputString
 * @returns {*}
 */
function getUA() {
	$.UUID = randomString(40)
	const buildMap = {
		"167814": `10.1.4`,
		"167841": `10.1.6`,
		"167853": `10.2.0`
	}
	$.osVersion = `${randomNum(13, 14)}.${randomNum(3, 6)}.${randomNum(1, 3)}`
	let network = `network/${['4g', '5g', 'wifi'][randomNum(0, 2)]}`
	$.mobile = `iPhone${randomNum(9, 13)},${randomNum(1, 3)}`
	$.build = ["167814", "167841", "167853"][randomNum(0, 2)]
	$.appVersion = buildMap[$.build]
	return `jdapp;iPhone;${$.appVersion};${$.osVersion};${$.UUID};M/5.0;${network};ADID/;model/${$.mobile};addressid/;appBuild/${$.build};jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS ${$.osVersion.replace(/\./g, "_")} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
}
/**
 * 随机 数字 + 大写字母 生成
 */
function randomString(e) {
    e = e || 32;
    var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}
/**
 * 随机 数字 + 小写字母 生成
 */
function randomsstring(e, t = "abcdefhijkmnprstwxyz123456789") {
        e = e || 32;
        let a = t.length,
            n = "";
        for (let i = 0; i < e; i++)
            n += t.charAt(Math.floor(Math.random() * a));
        return n
    }
function randomNum(min, max) {
	if (arguments.length === 0) return Math.random()
	if (!max) max = 10 ** (Math.log(min) * Math.LOG10E + 1 | 0) - 1
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function uuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
function getTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear(),
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
        D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()),
        h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()),
        m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()),
        s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
}
/**
 * 手机号中间遮挡
 */
function phone_num(phone_num) {
    if (phone_num.length == 11) {
        let data = phone_num.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
        return data;
    } else {
        return phone_num;
    }
}
// ============================================结束项目所需参数============================================ \\
function DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `${data}` } } else { console.log(`${data}`); msg += `${data}` } }
async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, '', message) } } else { console.log(message) } }
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

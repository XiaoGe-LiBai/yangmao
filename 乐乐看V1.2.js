/**
 * 
 * 项目类型：APP
 * 项目名称：乐乐看Pro
 * 项目更新：2023-08-08
 * 项目抓包：抓apillkpro.cengaw.cn下的Authorization&device&User-Agent填入变量
 * 项目变量：lekebo_llk_Cookie
 * 项目定时：每天运行10次
 * 定时规则: 10 7-22 * * *
 * 
 * 版本功能: 签到、宝箱、气泡、广告、看资讯、阅读、抽奖、闯关、游览、刷视频，后期会完善待增加的功能
 * 邀请下载：https://apillkpro.cengaw.cn/landing_page/1092603
 * 提现功能: 自己动提现
 * 
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */

const $ = new Env("乐乐看Pro");
//-------------------- 一般不动变量区域 -------------------------------------
const notify = $.isNode() ? require("./sendNotify") : "";
const CryptoJS = require("crypto-js");
const Notify = 0;		      //通知设置      0关闭  1开启
let debug = 0;                //Debug调试     0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';            //let ck,msg
let versionupdate = "0";      //版本对比升级   0关闭  1开启
//===============脚本版本=================//
let scriptVersion = "v1.2";
let update_tines = "2023-08-08";
let update_data = "2023-12-12";   //测试时间
let scriptVersionLatest = "v1.2"; //版本对比
let userCookie = ($.isNode() ? process.env.lekebo_llk_Cookie : $.getdata('lekebo_llk_Cookie')) || '';
let userList = [];
let userIdx = 0;
let date = require('silly-datetime');
let signTime = date.format(new Date(),'YYYY-MM-DD');
let times = Math.round(new Date().getTime() / 1000).toString();  //10位时间戳
let timestamp = Math.round(new Date().getTime()).toString();     //13位时间戳
let host = 'apillkpro.cengaw.cn';
let hostname = 'https://' + host;
//---------------------- 自定义变量区域 -----------------------------------
async function start() {
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.getMemberInfo(2 * 1000));
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
    DoubleLog(`\n================ 执行账号签到赚钱 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.signin(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行看广告赚金币 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(9,"广告视频",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行看资讯领金币 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(8,"阅读资讯",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行刷视频领金币 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(7,"刷视频金",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行阅读文章赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(24,"阅读文章",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    // DoubleLog(`\n================ 执行游览看看赚金 ================`)
    // taskall = [];
    // for (let user of userList) {
    //     taskall.push(await user.task(21,"看看赚金",2 * 1000));
    //     await $.wait(1000);
    // }
    // await Promise.all(taskall);
    DoubleLog(`\n================ 执行免费抽奖手机 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(4,"免费抽奖",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行闯关兑换手机 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.barrier(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行首页金币气泡 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.big(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.bubble(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.bubble2(2 * 1000));
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行定时红包赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.rain(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行助力领取现金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.helprain(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行账号得取现金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.withdraw(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
}

class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split('&');
        this.version = '108';
    }
// ============================================执行项目============================================ \\
    async getMemberInfo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/member/profile`,
                headers: {
                    Host: host,
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】用户信息: ${result.result.nickname}，余额：${result.result.balance} 元`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】用户信息: ${result.message}`)
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
                url: `${hostname}/api/v2/member/profile`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            this.cond = result.result.ticket;
                            DoubleLog(`\n ✅ 【${this.index}】收益信息: 提现卷${result.result.ticket}张,手机碎片${result.result.fragment}片`)
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
                url: `${hostname}/api/v2/reward/sign`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if(result.result.state == true){
                                DoubleLog(`\n ❌ 【${this.index}】签到信息: 今天已签到，已连续签到 ${result.result.days} 天`);
                            } else {
                                await this.open_signin(2 * 1000);
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
                url: `${hostname}/api/v2/reward/sign`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
                body: ``,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】签到信息: 获得奖励 ${result.result.coin} 金币，提现卷 ${result.result.coupon} 张`);
                            await $.wait(1500);
                            await this.open_signin(result.result.ticket,2 * 1000);
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
    async signin_video(ticket,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/ads/action/load?class=10000&&channel=2&type=1`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.signin_video_stop(result.result.tid,ticket,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: ${result.message}`);
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
    async signin_video_stop(tid,ticket,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/ads/action/completed?class=10000&type=1&ticket=${ticket}&ecpm=12388.284&tid=${tid}&platformname=1`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】签到视频: 获得奖励 ${result.result.coin?result.result.coin:result.result.reward} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: ${result.message}`);
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
                url: `${hostname}/api/v2/zhuan/index`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
                body: ``,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if(result.result.items && Array.isArray(result.result.items)) {
                                for(let i=0; i < result.result.items.length; i++) {
                                    let taskItem = result.result.items[i];
                                    //console.log(taskItem)
                                    if (taskItem.id == taskid) {
                                        if (taskItem.st == 0) {
                                            if (taskItem.id === 9) {
                                                let matchItem = taskItem.title.match(/"red">(\w+)<\/font>\/(\w+)/)
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 每天可完成${parseInt(matchItem[2])}次, 已完成 ${parseInt(matchItem[1])}/${parseInt(matchItem[2])} 次`);
                                                await this.video(9,taskname,2 * 1000);
                                            } else if (taskItem.id === 8) {
                                                let matchItem = taskItem.rate.split('$')
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 每天可完成${matchItem[1]}次, 已完成 ${matchItem[0]}/${matchItem[1]} 次`);
                                                await this.news(taskname,2 * 1000);
                                            } else if (taskItem.id === 4) {
                                                await this.luckydraw(14,taskname,2 * 1000);
                                            } else if (taskItem.id === 7) {
                                                let matchItem = taskItem.rate.split('$')
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 每天可完成${matchItem[1]}次, 已完成 ${matchItem[0]}/${matchItem[1]} 次`);
                                                await this.advideo(7,taskname,2 * 1000);
                                            } else if (taskItem.id === 21) {
                                                let matchItem = taskItem.rate.split('$')
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 每天可完成${matchItem[1]}次, 已完成 ${matchItem[0]}/${matchItem[1]} 次`);
                                                await this.kankan(taskname,2 * 1000);
                                            } else if (taskItem.id === 24) {
                                                let matchItem = taskItem.rate.split('$')
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 每天可完成${matchItem[1]}次, 已完成 ${matchItem[0]}/${matchItem[1]} 次`);
                                                await this.isfirst(taskname,2 * 1000);
                                            }
                                        } else if (taskItem.st == 1) {
                                            if (taskItem.id === 4) {
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 该任务已全部完成，去领取相应奖励`);
                                                await $.wait(1500);
                                                await this.open_done(taskItem.id,taskname,2 * 1000);
                                            } else if (taskItem.id === 7) {
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 该任务已全部完成，去领取相应奖励`);
                                                await $.wait(1500);
                                                await this.open_done(taskItem.id,taskname,2 * 1000);
                                            } else if (taskItem.id === 8) {
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 该任务已全部完成，去领取相应奖励`);
                                                await $.wait(1500);
                                                await this.open_done(taskItem.id,taskname,2 * 1000);
                                            } else if (taskItem.id === 9) {
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 该任务已全部完成，去领取相应奖励`);
                                                await $.wait(1500);
                                                await this.open_done(taskItem.id,taskname,2 * 1000);
                                            } else if (taskItem.id === 24) {
                                                DoubleLog(`\n ✅ 【${this.index}】${taskname}: 该任务已全部完成，去领取相应奖励`);
                                                await $.wait(1500);
                                                await this.open_done(taskItem.id,taskname,2 * 1000);
                                            }
                                        } else {
                                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: 该任务已达上限，请明天继续。`);
                                        }
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】获取任务: ${result.message}`);
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
    async advideo(typeid,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/video/coin`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.open_advideo(result.result.ticket,taskname,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async open_advideo(ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/video/coin?ticket=${ticket}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 获得奖励 ${result.result.reward} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async video(typeid,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/zhuan/video`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
                body: `type=1`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 成功获取广告内容，开始执行..`)
                            await this.open_video(typeid,result.result.ticket,taskname,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async open_video(typeid,ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/ads/action/load?class=10000&&channel=2&type=${typeid}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.open_video_stop(typeid,ticket,taskname,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async open_video_stop(typeid,ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/ads/action/completed?class=10000&type=1&ticket=${ticket}&ecpm=12388.284&tid=${typeid}&platformname=1`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 获得奖励 ${result.result.coin?result.result.coin:result.result.reward} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async news(taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/news/coin`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 预计可获得奖励 ${result.result.today_news_coin} 金币`);
                            await $.wait(1500);
                            await this.open_news(result.result.ticket,taskname,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async open_news(ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/news/coin?ticket=${ticket}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 获得奖励 ${result.result.reward} 金币`);
                        } else if (result.code == 40303) {
                            for (let i = 0; i < 6; i=i+1) {
                                await this.open_news_stop(ticket,taskname,2 * 1000);
                                await this.sleep_time(3,4)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.success}`);
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
    async open_news_stop(ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/news/coin?ticket=${ticket}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 阅读${result.result.today_news_total}次,获得${result.result.reward}金币,已赚${result.result.today_news_coin}金币`);
                        } else if (result.code == 40303) {
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.success}`);
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
    async kankan(taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/kan/index`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if(result.result.data && Array.isArray(result.result.data)) {
                                for(let i=0; i < result.result.data.length; i++) {
                                    let taskItem = result.result.data[i];
                                    if (taskItem.is_ok == 0) {
                                        await this.open_kankan(taskItem.id,taskname,2 * 1000);
                                    }
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async open_kankan(startid,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/kan/click?id=${startid}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.open_kankan_stop(result.result.id,result.result.ticket,taskname,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async open_kankan_stop(id,ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/kan/index`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
                body:`ticket=${ticket}&id=${id}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 获得奖励 ${result.result.coin} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async luckydraw(typeid,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/lottery/index`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
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
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 今天剩余 ${result.result.lottery_count} 次抽奖机会`);
                            await this.open_luckydraw(typeid,result.result.ticket,taskname,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async open_luckydraw(typeid,ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/ads/action/load?class=10000&&channel=2&type=${typeid}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.open_luckydraw_video(result.result.tid,ticket,taskname,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async open_luckydraw_video(tid,ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/ads/action/completed?class=10000&type=14&ticket=&ecpm=15000.0&tid=${tid}&platformname=1`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.open_luckydraw_stop(ticket,taskname,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async open_luckydraw_stop(ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/lottery/index`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
                body: `ticket=${ticket}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 获得奖励 ${result.result.lottery_count} 碎片，${result.result.num} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`);
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
    async barrier(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/barrier/index`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            for(let a in result.result.barrier){
                                if(result.result.barrier[a].state==0){
                                    this.no = parseInt(a) + 1
                                    await this.open_barrier(2 * 1000);
                                } else {
                                    DoubleLog(`\n ❌ 【${this.index}】手机闯关: 今天任务已达上限，明天再来..`);
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】手机闯关: ${result.message}`);
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
    async open_barrier(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/barrier/index`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
                body:`no=${this.no}&ticket=`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】手机闯关: 获得奖励 ${result.result.coin}`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】手机闯关: ${result.message}`);
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
    async isfirst(taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/news/sdk/zhuan/count?isfirstopen=0`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if (result.result.max == result.result.count) {
                                DoubleLog(`\n ❌ 【${this.index}】${taskname}: 当天任务已达上限，明天再来..`);
                            } else {
                                let count = Number(result.result.count);
                                let max = Number(result.result.max);
                                let num = Number(result.result.max) - Number(result.result.count);
                                if (max == count) {
                                    DoubleLog(`\n ❌ 【${this.index}】${taskname}: 当天任务已达上限，明天再来..`);
                                } else {
                                    DoubleLog(`\n ✅ 【${this.index}】${taskname}: 已完成 ${count} / ${max} 篇`);
                                }
                                // for (let i = 0; i < num; i=i+1) {
                                //     if (max == count) {
                                //         DoubleLog(`\n ❌ 【${this.index}】${taskname}: 当天任务已达上限，明天再来..`);
                                //         break;
                                //     } else {
                                //         await this.open_isfirst(i,max,taskname,2 * 1000);
                                //         await $.wait(5000);
                                //     }
                                //     if (i == num) {
                                //         break;
                                //     }
                                // }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】阅读文章: ${result.message}`);
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
    async open_isfirst(count,max,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/news/sdk/zhuan/count?isfirstopen=0`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 已完成第 ${count} / ${max} 篇阅读`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`)
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
    async rain(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/rain`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if (result.result.red_e_time > 0) {
                                DoubleLog(`\n ❌ 【${this.index}】时段红包: 下个时段：${$.time('mm:ss', result.result.red_e_time * 1000)}`);
                            } else {
                                await this.open_rain(2 * 1000);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】时段红包: ${result.message}`)
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
    async open_rain(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/rain`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】时段红包: 获得奖励 ${result.result.coin} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】时段红包: ${result.message}`)
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
    async big(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/coin/big`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.open_big(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币气泡: ${result.message}`)
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
    async open_big(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/coin/big`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】金币气泡: 获得奖励 ${result.result.coin} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币气泡: ${result.message}`)
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
    async bubble(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/bubble`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.open_bubble(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币气泡: ${result.message}`)
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
    async open_bubble(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/bubble`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】金币气泡: 获得奖励 ${result.result.coin} 金币,提现卷 ${result.result.coupon} 张`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币气泡: ${result.message}`)
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
    async bubble2(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/bubble2`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            await this.open_bubble2(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币气泡: ${result.message}`)
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
    async open_bubble2(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/bubble2`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】金币气泡: 获得奖励 ${result.result.coin} 金币,提现卷 ${result.result.coupon} 张`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币气泡: ${result.message}`)
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
    async helprain(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/help/index`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】助力领现: 金额${result.result.jinbi}元,还差${result.result.diff_jinbi}元提现`);
                            await this.open_helprain(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】助力领现: ${result.message}`)
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
    async open_helprain(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/reward/help/click`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if (result.message == "明天再继续") {
                                DoubleLog(`\n ❌ 【${this.index}】助力广告: 您今天任务上限，明天再继续`)
                            } else {
                                DoubleLog(`\n ✅ 【${this.index}】助力广告: 可获得金额 ${result.result.coin} 元`);
                                await this.open_helprain_video(result.result.ticket,2 * 1000);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】助力广告: ${result.message}`)
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
    async open_helprain_video(ticket,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/ads/action/completed?class=10000&type=12&ticket=${ticket}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】助力奖励: 获得奖励 ${result.result.reward} 金`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】助力奖励: ${result.message}`)
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
    async open_done(id,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/zhuan/done`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
                body:`id=${id}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 完成获得奖励 ${result.result.coin} 金币,提现卷 ${result.result.coupon} 张`);
                            await this.open_donevideo(result.result.ticket,taskname,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`)
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
    async open_donevideo(ticket,taskname,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/ads/action/completed?class=10000&type=1&ticket=${ticket}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】${taskname}: 广告获得奖励 ${result.result.reward} 金币,提现卷 ${result.result.coupon} 张`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】${taskname}: ${result.message}`)
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
    async withdraw(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/cash/exchange`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            if(result.result.items && Array.isArray(result.result.items)) {
                                for(let i=0; i < result.result.items.length; i++) {
                                    let taskItem = result.result.items[i];
                                    if (taskItem.is_ok == 1) {
                                        if (this.cond >= taskItem.cond) {
                                            if (taskItem.jine == 5) {
                                                DoubleLog(`\n ✅ 【${this.index}】查询提现: 准备提现 ${taskItem.jine} 元`);
                                                await this.open_withdraw(taskItem.jine,2 * 1000);
                                                break;
                                            }
                                        } else {
                                            DoubleLog(`\n ✅ 【${this.index}】查询提现: 准备提现 ${taskItem.jine} 元`);
                                            await this.open_withdraw(taskItem.jine,2 * 1000);
                                        }
                                    } else {
                                        DoubleLog(`\n ❌ 【${this.index}】查询提现: 抱歉没有符合你的提现要求。`)
                                        break;
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】查询提现: ${result.message}`)
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
    async open_withdraw(amount,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/v2/cash/exchange`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "accept": `application/json`,
				    'device': this.ck[1],
                    'oaid': this.ck[1],
                    'store': 'website',
                    'version': this.version,
                    'platform': '1',
                    'Authorization': 'Bearer ' + this.ck[0],
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; Build/QKQ1.191008.001)',
                },
                body: `amount=${amount}&gate=wechat&`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】查询提现: ${result.result.title}，提现 ${amount} 元`);
                        } else if (result.code == 40354) {
                            DoubleLog(`\n ❌ 【${this.index}】提取现金: 每天只能提一次，请明天再提吧`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】提取现金: ${result.message}`);
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
    async sleep_time(min, max) {
        await $.wait(Math.floor(Math.random() * (max * 1000 - min * 1000 + 1)) + min * 1000)
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
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_llk.js`,
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

/**
 * 
 * 项目类型：APP
 * 项目名称：有柿
 * 项目更新：2023-08-03
 * 项目抓包：抓api5-normal-lf.toutiaoapi.com下的url#cookie#x-argus#x-ladon#user-agent填入变量
 * 项目变量：lekebo_yssp_Cookie
 * 项目定时：每小时运行一次
 * 定时规则: 10 7-22 * * *   （多账号建议为2个小时运行一次，单账号为1小时一次更皆）
 * 
 * 版本功能: 签到、吃饭、宝箱、广告、阅读、农场，后期会完善待增加的功能
 *
 * 
 * 提现功能: 一机跑多号容易黑，建议跑单号，如果开不了宝箱或溜走挂个一两天就恢复正常。
 * 
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */

const $ = new Env("有柿");
//-------------------- 一般不动变量区域 -------------------------------------
const notify = $.isNode() ? require("./sendNotify") : "";
const CryptoJS = require("crypto-js");
const Notify = 0;		      //通知设置      0关闭  1开启
let debug = 0;                //Debug调试     0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';            //let ck,msg
let versionupdate = "0";      //版本对比升级   0关闭  1开启
let readnum = '10';          //循环看广告次数
let numamount = '50';         //金币低于不反复任务
//===============脚本版本=================//
let scriptVersion = "v1.1";
let update_tines = "2023-08-03";
let update_data = "2023-12-12";   //测试时间
let scriptVersionLatest = "v1.1"; //版本对比
let userCookie = ($.isNode() ? process.env.lekebo_yssp_Cookie : $.getdata('lekebo_yssp_Cookie')) || '';
let userList = [];
let userIdx = 0;
let date = require('silly-datetime');
let signTime = date.format(new Date(),'YYYY-MM-DD');
let timeHours = parseInt($.time('HH'));
let times = Math.round(new Date().getTime() / 1000).toString();  //10位时间戳
let timestamp = Math.round(new Date().getTime()).toString();     //13位时间戳
let host = 'api5-normal-lf.toutiaoapi.com';
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
    DoubleLog(`\n================ 执行账号走路赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.step(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行账号吃饭赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.doneeat(2 * 1000));
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行账号睡觉赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.sleepstart(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行开宝箱赚金币 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.treasure(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行观看视频赚金 ================`)
    taskall = [];
    for (let user of userList) {
        //taskall.push(await user.double(2 * 1000));
        //await $.wait(1000);
        taskall.push(await user.readduration(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.readDouble(2 * 1000));
        // await $.wait(1000);
        // taskall.push(await user.newuserrecord_video(2 * 1000));
    }
    await Promise.all(taskall);
}

class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split('#');
		this.sdkversion = "3.5.0.cn";
		this.passportsdk = "40444";
    }
// ============================================执行项目============================================ \\
    async getMemberInfo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/2/user/info/?abc=true&${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.message == 'success') {
                            DoubleLog(`\n ✅ 【${this.index}】用户信息: ${result.data.mobile}，${result.data.name}`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】用户信息: ${result.err_tips}`)
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
                url: `${hostname}/luckycat/gip/v1/page/profit?offset=0&share_page=profits_detail_page&income_type=2&num=300&key=score&${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】收益信息: 今天收入${result.data.score_balance}金币,现金${result.data.cash_balance / 100}元`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】收益信息: ${result.err_tips}`)
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
                url: `${hostname}/luckycat/gip/v1/page/task?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/json`,
					'x-vc-bdturing-sdk-version': this.sdkversion,
					'passport-sdk-version': this.passportsdk,
					'x-ss-req-ticket': timestamp,
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
							if (result.data.signin_detail.today_signed == true) {
                                DoubleLog(`\n ❌ 【${this.index}】签到信息: 今天已签到，已连续签到 ${result.data.signin_detail.days} 天`);
                            } else {
                                await this.open_signin(2 * 1000);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到信息: ${result.err_tips}`)
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
                url: `${hostname}/luckycat/gip/v1/daily/consume_sign_in/action?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': this.sdkversion,
					'passport-sdk-version': this.passportsdk,
					'x-ss-req-ticket': timestamp,
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
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
                            DoubleLog(`\n ✅ 【${this.index}】签到信息: 获得奖励 ${result.amount} 金币`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到信息: ${result.err_tips}`)
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
    async signin_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/gip/v1/task/done/ad_watch_daily_again?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'x-vc-bdturing-sdk-version': this.sdkversion,
					'passport-sdk-version': this.passportsdk,
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `ad_fallback=false&enter_from=goldcoin_pendant&income_id=1009603_104711869254_1690705862162&creator_id=1009603&reward_stage=2&ad_seconds=25000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 10006) {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: 每天签到广告赚金币已达上限`);
                        } else if (result.err_no == 10007) {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: 该账号没有可执行任务，可能是新号`);
                        } else if (result.err_no == 10009) {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: 执行任务过快，继续执行任务`);
                        } else if (result.err_no == 0) {
                            for (let i = 0; i < numvodie; i=i+1) {
                                if (result.err_no == 10006) {
                                    DoubleLog(`\n ❌ 【${this.index}】签到视频: 每天签到广告赚金币已达上限`);
                                    break;
                                } else if (result.err_no == 10007) {
                                    DoubleLog(`\n ❌ 【${this.index}】签到视频: 该账号没有可执行任务，可能是新号`);
                                    break;
                                } else if (result.err_no == 10009) {
                                    DoubleLog(`\n ❌ 【${this.index}】签到视频: 执行任务过快，继续执行任务`);
                                } else if (result.data.amount < numamount) {
                                    DoubleLog(`\n ✅ 【${this.index}】签到视频: 获得奖励 ${result.data.amount} 金币，收入低停止执行`);
                                    break;
                                } else {
                                    await this.signin_video_stop(2 * 1000);
                                    await $.wait(30000);
                                }
                                if (i == numvodie) {
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: ${result.err_tips}`);
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
    async signin_video_stop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/xigua/v1/task/done/ad_watch_daily_again?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `ad_fallback=false&reward_stage=2&income_id=1009601_109521973635_1689925372308`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】签到视频: 获得奖励 ${result.data.amount} 金币`);
                        } else if (result.err_no == 10006) {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: 每天签到广告赚金币已达上限`);
                        } else if (result.err_no == 10007) {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: 该账号没有可执行任务，可能是新号`);
                        } else if (result.err_no == 10009) {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: 执行任务过快，继续执行任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: ${result.err_tips}`);
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
    async doneeat(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/eat/eat_info?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let timeHours = parseInt($.time('HH'));
                            if (timeHours > 5 && timeHours < 9) {
                                DoubleLog(`\n ✅ 【${this.index}】吃饭打卡: 该时间为早餐段，执行早餐任务`);
                                await $.wait(1000);
                                await this.open_doneeat(0,2 * 1000);
                            } else if (timeHours > 11 && timeHours < 14) {
                                DoubleLog(`\n ✅ 【${this.index}】吃饭打卡: 该时间为午餐段，执行午餐任务`);
                                await $.wait(1000);
                                await this.open_doneeat(1,2 * 1000);
                            } else if (timeHours > 17 && timeHours < 19) {
                                DoubleLog(`\n ✅ 【${this.index}】吃饭打卡: 该时间为晚餐段，执行晚餐任务`);
                                await $.wait(1000);
                                await this.open_doneeat(2,2 * 1000);
                            } else if (timeHours > 21 && timeHours < 23) {
                                DoubleLog(`\n ✅ 【${this.index}】吃饭打卡: 该时间为夜宵段，执行夜宵任务`);
                                await $.wait(1000);
                                await this.open_doneeat(3,2 * 1000);
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】吃饭打卡: 该时间段不在指定任务当中`);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】吃饭打卡: ${result.err_tips}`)
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
    async open_doneeat(timeid,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/eat/done_eat?_request_from=web&${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `time_conf_id=${timeid}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】吃饭打卡: 获得 ${result.data.amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】吃饭打卡: ${result.err_tips}`)
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
    async sleepstart(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/sleep/status?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let sleepHour = Math.floor(result.data.sleep_last_time / 36) / 100
                            if (result.data.sleeping == true) {
                                if (sleepHour >= 12) {
                                    await this.sleepstop(2 * 1000)
                                } else if (result.data.sleep_unexchanged_score == result.data.max_coin && curHour >= 7) {
                                    let rnd = Math.random()
                                    if (rnd > 0.95) {
                                        await this.sleepstop(2 * 1000)
                                    } else {
                                        DoubleLog(`\n ✅ 【${this.index}】睡眠状态: 已经睡了${sleepHour}小时，可以获得${result.data.sleep_unexchanged_score}金币`)
                                    }
                                } else {
                                    DoubleLog(`\n ✅ 【${this.index}】睡眠状态: 已经睡了${sleepHour}小时，可以获得${result.data.sleep_unexchanged_score}金币`)
                                }
                            } else {
                                if (result.data.history_amount > 0) {
                                    await this.sleepDone(result.data.history_amount);
                                }
                                if (timeHours >= 22 || timeHours < 2) {
                                    await this.open_sleeps(2 * 1000)
                                } else if (timeHours >= 20) {
                                    let rnd = Math.random()
                                    if (rnd > 0.95) {
                                        await this.open_sleeps(2 * 1000)
                                    } else {
                                        DoubleLog(`\n ❌ 【${this.index}】睡眠状态: 随机睡眠时间，本次不进行睡眠`)
                                    }
                                } else {
                                    DoubleLog(`\n ❌ 【${this.index}】睡觉失败: 未到睡觉时间`)
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】睡觉失败: ${result.err_tips}`)
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
    async open_sleeps(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/sleep/start?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】开睡成功: 开始睡觉，ZZZzzz...`);
                            await this.sleepDone(result.data.history_amount)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】开睡失败: ${result.err_tips}`)
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
    async sleepDone(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/eat/done_eat?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】睡眠状态: 获得 ${result.data.score_amount} 金币`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】睡眠状态: ${result.err_tips}`)
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
    async sleepstop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/sleep/stop?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】领取睡金: 获得奖励 ${result.data.history_amount} 金币`);
                            await this.open_sleep(result.data.history_amount,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】领取睡金: ${result.err_tips}`)
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
    async open_sleep(amount,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/sleep/done_task?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"score_amount":${amount}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】领取睡金: 获得奖励 ${result.data.score_amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】领取睡金: ${result.err_tips}`)
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
    async treasure(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/gip/v1/page/task?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/json`,
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let cur_time = result.data.treasure.current_time;
                            let next_time = result.data.treasure.next_treasure_time;
                            if (next_time <= cur_time) {
                                DoubleLog(`\n ✅ 【${this.index}】打开宝箱: 正在执行获取宝箱任务请等待...`);
                                await $.wait(1000);
                                await this.open_treasure(2 * 1000);
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】打开宝箱: 下次开宝箱：${$.time('yyyy-MM-dd HH:mm:ss', next_time * 1000)}`);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】打开宝箱: ${result.message}`)
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
    async open_treasure(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/treasure/open_treasure_box?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】打开宝箱: 获得奖励 ${result.data.score_amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】打开宝箱: ${result.err_tips}`)
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
    async treasure_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/xigua/v1/task/done/coin_chest_ad?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `ad_fallback=false&enter_from=goldcoin_pendant&income_id=1009606_104711869254_1690706820521&creator_id=1009606&reward_stage=2&ad_seconds=25000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            await this.treasure_video_status(2 * 1000);
                            await $.wait(30000);
                        } else if (result.err_no == 10006) {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: 每天宝箱广告赚金币已达上限`);
                        } else if (result.err_no == 10007) {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: 该账号没有可执行任务，可能是新号`);
                        } else if (result.err_no == 10009) {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: 执行任务过快，继续执行任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到视频: ${result.err_tips}`);
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
    async treasure_video_status(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/xigua/v1/task/done/ad_watch_daily_again?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `ad_fallback=false&reward_stage=2&income_id=1009606_104711869254_1690706820521&enter_from=goldcoin_pendant&creator_id=1009606000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱视频: 获得奖励 ${result.data.amount} 金币`);
                            for (let i = 0; i < numvodie; i=i+1) {
                                if (result.data.amount < numamount) {
                                    DoubleLog(`\n ✅ 【${this.index}】宝箱视频: 获得奖励 ${result.data.amount} 金币，收入低停止执行`);
                                    break;
                                } else {
                                    await this.treasure_video_stop(2 * 1000);
                                    await $.wait(30000);
                                }
                                if (i == numvodie) {
                                    break;
                                }
                            }
                        } else if (result.err_no == 10006) {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: 每天宝箱广告赚金币已达上限`);
                        } else if (result.err_no == 10007) {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: 该账号没有可执行任务，可能是新号`);
                        } else if (result.err_no == 10009) {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: 执行任务过快，继续执行任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: ${result.err_tips}`)
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
    async treasure_video_stop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/xigua/v1/task/done/ad_watch_daily_again?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `ad_fallback=false&reward_stage=2&income_id=1009606_104711869254_1690706820521&enter_from=goldcoin_pendant&creator_id=1009606000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱视频: 获得奖励 ${result.data.amount} 金币`);
                        } else if (result.err_no == 10006) {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: 每天宝箱广告赚金币已达上限`);
                        } else if (result.err_no == 10007) {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: 该账号没有可执行任务，可能是新号`);
                        } else if (result.err_no == 10009) {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: 执行任务过快，继续执行任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: ${result.err_tips}`)
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
    async video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/xigua/v1/task/page?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let cur_time = date.format(new Date(),'YYYY-MM-DD HH:mm:ss');
                            if(result.data.task_list && Array.isArray(result.data.task_list)) {
                                for(let i=0; i < result.data.task_list.length; i++) {
                                    let taskItem = result.data.task_list[i];
                                    if (taskItem.task_id == 400202) {
                                        let status_extra = JSON.parse(taskItem.status_extra);
                                        let nextfinish = status_extra.last_finish_time + status_extra.finish_interval;
                                        let next_time= getTime(nextfinish * 1000).toString();
                                        if (status_extra.is_completed == true) {
                                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: 每天可完成${status_extra.daily_max_count}次, 已完成 ${status_extra.daily_finish_count}/${status_extra.daily_max_count} 次`);
                                        } else {
                                            if (next_time > cur_time) {
                                                DoubleLog(`\n ❌ 【${this.index}】广告赚金: 下次看广告：${next_time}`)
                                            } else {
                                                if (status_extra.daily_max_count == status_extra.daily_finish_count) {
                                                    DoubleLog(`\n ❌ 【${this.index}】广告赚金: 每天可完成${status_extra.daily_max_count}次, 已完成 ${status_extra.daily_finish_count}/${status_extra.daily_max_count} 次`);
                                                } else {
                                                    DoubleLog(`\n ✅ 【${this.index}】广告赚金: 每天可完成${status_extra.daily_max_count}次, 已完成 ${status_extra.daily_finish_count}/${status_extra.daily_max_count} 次`);
                                                    await this.open_video(2 * 1000);
                                                }
                                            }
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
    async open_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/xigua/v1/task/done/ad_watch_daily?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `ad_fallback=false&enter_from=my_view_cash&income_id=1009604_104711869254_1689831458308&creator_id=1009604&reward_stage=2&ad_seconds=25000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】广告赚金: 获得奖励 ${result.data.amount} 金币`);
                        } else if (result.err_no == 10006) {
                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: 每天视频广告赚金币已达上限`);
                        } else if (result.err_no == 10007) {
                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: 该账号没有可执行任务，可能是新号`);
                        } else if (result.err_no == 10009) {
                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: 执行任务过快，继续执行任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: ${result.err_tips}`);
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
    async ad_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/xigua/v1/task/done/ad_watch_daily_again?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `ad_fallback=false&reward_stage=2&income_id=1009604_104711869254_1689831458308&enter_from=my_view_cash&creator_id=1009604000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 10006) {
                            DoubleLog(`\n ❌ 【${this.index}】激励广告: 每天激励广告赚金币已达上限`);
                        } else if (result.err_no == 10007) {
                            DoubleLog(`\n ❌ 【${this.index}】激励广告: 该账号没有可执行任务，可能是新号`);
                        } else if (result.err_no == 10009) {
                            DoubleLog(`\n ❌ 【${this.index}】激励广告: 执行任务过快，继续执行任务`);
                        } else if (result.err_no == 0) {
                            for (let i = 0; i < numvodie; i=i+1) {
                                if (result.err_no == 10006) {
                                    DoubleLog(`\n ❌ 【${this.index}】激励广告: 每天激励广告赚金币已达上限`);
                                    break;
                                } else if (result.err_no == 10007) {
                                    DoubleLog(`\n ❌ 【${this.index}】激励广告: 该账号没有可执行任务，可能是新号`);
                                    break;
                                } else if (result.err_no == 10009) {
                                    DoubleLog(`\n ❌ 【${this.index}】激励广告: 执行任务过快，继续执行任务`);
                                } else if (result.data.amount < numamount) {
                                    DoubleLog(`\n ✅ 【${this.index}】激励广告: 获得奖励 ${result.data.amount} 金币，收入低停止执行`);
                                    break;
                                } else {
                                    await this.ad_video_stop(2 * 1000);
                                    await $.wait(30000);
                                }
                                if (i == numvodie) {
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】激励广告: ${result.err_tips}`);
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
    async ad_video_stop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/xigua/v1/task/done/ad_watch_daily_again?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `ad_fallback=false&reward_stage=2&income_id=1009604_104711869254_1689831458308&enter_from=my_view_cash&creator_id=1009604000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】激励广告: 获得奖励 ${result.data.amount} 金币`);
                        } else if (result.err_no == 10006) {
                            DoubleLog(`\n ❌ 【${this.index}】激励广告: 每天激励广告赚金币已达上限`);
                        } else if (result.err_no == 10007) {
                            DoubleLog(`\n ❌ 【${this.index}】激励广告: 该账号没有可执行任务，可能是新号`);
                        } else if (result.err_no == 10009) {
                            DoubleLog(`\n ❌ 【${this.index}】激励广告: 执行任务过快，继续执行任务`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】激励广告: ${result.err_tips}`);
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
    async step(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/walk/page_data?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/json',
                    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            if (result.data.can_get_amount > 0) {
                                await this.step_reward(2 * 1000);
                            } else {
                                if(result.data.history_walk_info && Array.isArray(result.data.history_walk_info)) {
                                    for(let i=0; i < result.data.history_walk_info.length; i++) {
                                        let taskItem = result.data.history_walk_info[i];
                                        DoubleLog(`\n ✅ 【${this.index}】今日步数: 今日步数:${taskItem.walk_number}步，已领取${taskItem.has_get_award_amount}金币`);
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】今日步数: ${result.err_tips}`)
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
    async open_step(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/walk/step_submit?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"step":${parseInt((10000 + Math.random() * 10000) + "")},"submit_time":${parseInt((new Date().getTime() / 1000) + "")}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】上传步数: 今日提交步数：${result.data.today_step} 步`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】上传步数: ${result.err_tips}`)
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
    async step_reward(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/walk/done_task?_request_from=web&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json; charset=utf-8',
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: `{"task_id":136,"client_time":${times},"rit":"","use_ecpm":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】步数奖励: 获得奖励 ${result.data.score_amount} 金币`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】步数奖励: ${result.err_tips}`)
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
    async double(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/activity/done_whole_scene_task?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 200) {
                            DoubleLog(`\n ✅ 【${this.index}】翻倍成功: 视频翻倍中，今日有效。`);
                            await $.wait(1000);
                            await this.readduration(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】翻倍失败: ${result.err_tips}`)
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
    async readduration(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/gip/v1/page/task?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": 'application/json',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            if(result.data.task_list.special && Array.isArray(result.data.task_list.special)) {
                                for(let i=0; i < result.data.task_list.special.length; i++) {
                                    let taskItem = result.data.task_list.special[i];
                                    if (taskItem.task_id == 333) {
                                        let status_extra = JSON.parse(taskItem.extra);
                                        DoubleLog(`\n ✅ 【${this.index}】阅读统计: 已赚 ${status_extra.total_score_amount} 金,阅读时长${$.time('mm:ss', status_extra.daily_use_duration * 1000)}分钟`); 
                                        await $.wait(1000);
                                        for (let i = 1; i < readnum; i=i+1) {
                                            await this.readDouble(i,2 * 1000);
                                            await $.wait(randomNum(28, 36) * 1000);
                                        }
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】阅读赚金: ${result.err_tips}`)
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
    async readDouble(num,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/activity/done_whole_scene_task?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": 'application/json',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"group_id": "", "scene_key": "UgcInnerFeed","is_golden_egg": false}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】阅读赚金: 第次 ${num} 阅读，获得奖励 ${result.data.score_amount} 金`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】阅读赚金: ${result.err_tips}`)
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
    console.log(`\n================ 本次运行脚本结束 ===============`);
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
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_yssp.js`,
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

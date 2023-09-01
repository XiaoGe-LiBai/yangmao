/**
 * 
 * 项目类型：APP
 * 项目名称：番茄畅听音乐版
 * 项目更新：2023-09-01
 * 项目抓包：抓api5-lite-lq.novelfm.com下的宝箱url#cookie#x-argus#x-ladon#user-agent填入变量
 * 开启抓包，点击宝箱获得金币，点击弹出的看广告，看完一段广告，搜索/luckycat/novelfm_vest/v1/task/done/excitation_ad
 * 项目抓包：复制/luckycat/novelfm_vest/v1/task/done/excitation_ad?后面的值，后面的值#cookie#x-argus#x-ladon#user-agent
 * 项目变量：lekebo_fqct_Cookie
 * 项目定时：每30分钟运行一次
 * 定时规则: * 25 0-23 * * *
 * 
 * 版本功能: 签到、宝箱、广告、音乐、吃饭、睡觉、农场，后期会完善待增加的功能
 * 
 * 更新内容: 
 * 
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */

const $ = new Env("番茄畅听音乐版");
// ================================ 脚本系统变量区域 ================================= \\
const notify = $.isNode() ? require("./sendNotify") : "";
const CryptoJS = require("crypto-js");
const Notify = 0;		      //通知设置      0关闭  1开启
let debug = 0;                //Debug调试     0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';            //let ck,msg
// ================================== 项目所需参数 =================================== \\
let versionupdate = "0";      //版本对比升级   0关闭  1开启
let numvodie = '10';          //循环看广告次数
// ================================== 脚本版本参数 =================================== \\
let scriptVersion = "v1.1";
let update_tines = "2023-09-01";
let update_data = "2023-12-12";   //测试时间
let scriptVersionLatest = "v1.1"; //版本对比
let userCookie = ($.isNode() ? process.env.lekebo_fqctyl_Cookie : $.getdata('lekebo_fqctyl_Cookie')) || '';
let userList = [];
let userIdx = 0;
let date = require('silly-datetime');
let signTime = date.format(new Date(),'YYYY-MM-DD');
let curTime = new Date();
let curHour = curTime.getHours();
let timeHours = parseInt($.time('HH'));
let times = Math.round(new Date().getTime() / 1000).toString();  //10位时间戳
let timestamp = Math.round(new Date().getTime()).toString();     //13位时间戳
let host = 'api5-lite-lq.novelfm.com';
let hostname = 'http://' + host;
// ================================ 脚本任务区域 ================================= \\
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
    DoubleLog(`\n================ 执行吃饭打卡赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.doneeat(2 * 1000));
        await $.wait(1000);
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
    DoubleLog(`\n================ 执行看广告赚金币 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.video(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行听音乐赚金币 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.music(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行听书宝箱抽奖 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.lottery(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.lottery_reward(2 * 1000));
    }
    await Promise.all(taskall);
    // DoubleLog(`\n================ 执行听看小说赚金 ================`)
    // taskall = [];
    // for (let user of userList) {
    //     taskall.push(await user.readbook(2 * 1000));
    //     await $.wait(1000);
    //     //taskall.push(await user.listening(2 * 1000));
    // }
    // await Promise.all(taskall);
    // DoubleLog(`\n================ 执行果树农场赚金 ================`)
	// taskall = [];
    // for (let user of userList) {
    //     taskall.push(await user.queryFarmSignStatus(2 * 1000));
    //     taskall.push(await user.queryFarmInfo(2 * 1000));
    //     taskall.push(await user.queryFarmLandStatus(2 * 1000));
    //     taskall.push(await user.queryFarmTask(2 * 1000));
    // }
    // await Promise.all(taskall);
}

class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split('#');
    }
// ============================================执行项目============================================ \\
    async getMemberInfo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/novelfm/userapi/user_info/v1/?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】用户信息: ${result.data.user_profile.username}`)
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
                url: `${hostname}/luckycat/novelfm_vest/v2/task/page?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】金币收益: 今日收入${result.data.income_data.amount1}金币,余额${result.data.income_data.amount2 / 100}元`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币收益: ${result.err_tips}`)
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
                url: `${hostname}/luckycat/novelfm_vest/v2/task/page?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            if(result.data.task_list && Array.isArray(result.data.task_list)) {
                                for(let i=0; i < result.data.task_list.length; i++) {
                                    let taskItem = result.data.task_list[i];
                                    if(taskItem.task_id == "17") {
                                        if(taskItem.is_completed == true) {
                                            DoubleLog(`\n ❌ 【${this.index}】签到信息: 今天已签到，已连续签到 ${taskItem.action_times} 天`)
                                        } else {
                                            await this.opensign(2 * 1000);
                                        }
                                    }
                                }
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】任务列表: 没有找到任务相关列表`)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】任务列表: ${result.err_tips}`)
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
    async opensign(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v2/task/done/sign_in?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
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
                            DoubleLog(`\n ✅ 【${this.index}】签到成功: 获得奖励 ${result.data.amount} 金币`);
                            await this.signin_video(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到失败: ${result.err_tips}`)
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
            this.signinstop = false;
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_signin?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"from":"excitation_ad_signin","position":"","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】签到广告: 获得奖励 ${result.data.amount} 金币`);
                            await $.wait(30000);
                            await this.signin_video_Status(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到广告: ${result.err_tips}`)
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
    async signin_video_Status(num,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_repeat?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】签到追加: 获得奖励 ${result.data.amount} 金币`);
                            await $.wait(30000);
                            await this.signin_video_Status(2 * 1000);
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
                url: `${hostname}/luckycat/novelfm_vest/v2/task/page?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let cur_time = result.data.treasure_stats.cur_time;
                            let next_time = result.data.treasure_stats.next_time;
                            if (next_time <= cur_time) {
                                DoubleLog(`\n ✅ 【${this.index}】打开宝箱: 正在执行获取宝箱任务请等待...`);
								await $.wait(1000);
                                await this.open_treasure(2 * 1000);
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】打开宝箱: 下次开宝箱：${$.time('yyyy-MM-dd HH:mm:ss', next_time * 1000)}`);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱广告: ${result.err_tips}`);
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
                url: `${hostname}/luckycat/novelfm_vest/v2/task/done/treasure_task?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
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
                            DoubleLog(`\n ✅ 【${this.index}】打开宝箱: 获得 ${result.data.amount} 金币,广告预计${result.data.new_excitation_ad.score_amount}金币`);
                            await $.wait(1000);
                            await this.treasure_video(2 * 1000);
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
            this.treasurestop = false;
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v2/task/done/excitation_ad_treasure_box?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"from":"excitation_ad_treasure_box","position":"","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱广告: 获得奖励 ${result.data.amount} 金币`);
                            await $.wait(30000);
                            await this.treasure_video_Status(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱广告: ${result.err_tips}`);
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
    async treasure_video_Status(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_repeat?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】广告追加: 获得奖励 ${result.data.amount} 金币`);
                            await $.wait(30000);
                            await this.treasure_video_Status(2 * 1000);
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
                url: `${hostname}/luckycat/novelfm_vest/v2/task/page?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            if(result.data.task_list && Array.isArray(result.data.task_list)) {
                                for(let i=0; i < result.data.task_list.length; i++) {
                                    let taskItem = result.data.task_list[i];
                                    if (taskItem.task_id == "16") {
                                        let tasklist = JSON.parse(taskItem.extra);
                                        if (taskItem.is_completed == true) {
                                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: 每天可完成${taskItem.action_times}次, 已完成 ${tasklist.total_times}/${taskItem.action_times} 次`);
                                        } else {
                                            if(tasklist.countdown > 0) {
                                                DoubleLog(`\n ❌ 【${this.index}】广告赚金: 距离下一次广告还剩：${$.time('mm:ss', tasklist.countdown * 1000)} 分钟`);
                                            } else {
                                                DoubleLog(`\n ✅ 【${this.index}】广告赚金: 每天可完成${taskItem.action_times}次, 已完成 ${tasklist.total_times}/${taskItem.action_times} 次`);
                                                await this.open_video(2 * 1000);
                                            }
                                        }
                                    }
                                }
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】广告赚金: 此账号没有该任务，不做执行操作。`)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】任务列表: ${result.err_tips}`)
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
                url: `${hostname}/luckycat/novelfm_vest/v2/task/done/excitation_ad?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"from":"excitation_ad","position":"task_page","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】广告奖励: 获得奖励 ${result.data.amount} 金币`);
                            await $.wait(30000);
                            await this.open_video_Status(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】广告奖励: ${result.err_tips}`);
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
    async open_video_Status(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_repeat?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】广告追加: 获得奖励 ${result.data.amount} 金币`);
                            await $.wait(30000);
                            await this.open_video_Status(2 * 1000);
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
                url: `${hostname}/luckycat/novelfm_vest/v2/task/page?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            if(result.data.task_list && Array.isArray(result.data.task_list)) {
                                for(let i=0; i < result.data.task_list.length; i++) {
                                    let taskItem = result.data.task_list[i];
                                    if (taskItem.task_id == "1095") {
                                        let tasklist = JSON.parse(taskItem.status_extra);
                                        let next_time = tasklist.end_time;
                                        if (taskItem.is_completed == true) {
                                            DoubleLog(`\n ❌ 【${this.index}】吃饭补贴: 今日${taskItem.action_times}个打卡已达上限，请明日再来`)
                                        } else {
                                            if (timeHours > 4 && timeHours < 9) {
                                                DoubleLog(`\n ✅ 【${this.index}】吃饭补贴: 该时间为早餐段，执行早餐任务`);
                                                await $.wait(1000);
                                                await this.open_doneeat(0,2 * 1000);
                                            } else if (timeHours > 10 && timeHours < 14) {
                                                DoubleLog(`\n ✅ 【${this.index}】吃饭补贴: 该时间为午餐段，执行午餐任务`);
                                                await $.wait(1000);
                                                await this.open_doneeat(1,2 * 1000);
                                            } else if (timeHours > 16 && timeHours < 20) {
                                                DoubleLog(`\n ✅ 【${this.index}】吃饭补贴: 该时间为晚餐段，执行晚餐任务`);
                                                await $.wait(1000);
                                                await this.open_doneeat(2,2 * 1000);
                                            } else if (timeHours > 20 && timeHours < 24) {
                                                DoubleLog(`\n ✅ 【${this.index}】吃饭补贴: 该时间为夜宵段，执行夜宵任务`);
                                                await $.wait(1000);
                                                await this.open_doneeat(3,2 * 1000);
                                            } else {
                                                DoubleLog(`\n ❌ 【${this.index}】吃饭补贴: 下次打卡：${$.time('yyyy-MM-dd HH:mm:ss', next_time * 1000)}`);
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】吃饭打卡: ${result.err_tips}`);
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
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/meal?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/json; charset=utf-8',
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                    'user-agent': this.ck[4],
                },
                body: `{"meal_type":${timeid}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】吃饭奖励: 获得奖励 ${result.data.amount} 金币,广告预计${result.data.excitation_ad_info.amount}金币`);
                            await $.wait(1000);
                            await this.doneeat_video(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】吃饭奖励: ${result.err_tips}`)
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
    async doneeat_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/meal_excitation_ad?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{"from":"meal_ad_award","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】吃饭广告: 获得奖励 ${result.data.amount} 金币`);
                            await $.wait(1000);
                            await this.doneeat_video_status(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】吃饭广告: ${result.err_tips}`)
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
    async doneeat_video_status(num,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_repeat?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{"reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】追加奖励: 获得奖励 ${result.data.amount} 金币`);
                            await $.wait(1000);
                            await this.doneeat_video_status(2 * 1000);
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
                url: `${hostname}/luckycat/novelfm_vest/v1/task/sleep/page?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let sleepHour = Math.floor(result.data.income_info.sleep_duration / 3600) / 1000;
                            if (result.data.button_text.disable == true) {
                                if (sleepHour >= 12) {
                                    await this.sleepStop(2 * 1000)
                                } else if (curHour >= 7) {
                                    let rnd = Math.random()
                                    if (rnd > 0.95) {
                                        await this.sleepStop(2 * 1000)
                                    } else {
                                        DoubleLog(`\n ✅ 【${this.index}】睡眠状态: 已经睡了${sleepHour}小时，可以获得${result.data.income_info.amount}金币`)
                                    }
                                } else {
                                    DoubleLog(`\n ✅ 【${this.index}】睡眠状态: 已经睡了${sleepHour}小时，可以获得${result.data.income_info.amount}金币`)
                                }
                            } else {
                                if (result.data.ui_status == 7) {
                                    DoubleLog(`\n ✅ 【${this.index}】睡眠状态: 已经睡了${sleepHour}小时，可以获得${result.data.income_info.amount}金币`);
                                } else {
                                    await this.sleepStart(2 * 1000)
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
    async sleepStart(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/sleep?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{"done_type":"start_sleep"}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        console.log(result)
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
    async sleepStop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v2/sleep/stop/?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let sleepHour = Math.floor(result.data.sleep_last_time / 36) / 100
                            DoubleLog(`\n ✅ 【${this.index}】结束睡眠: 本次睡了${sleepHour}小时，可以领取${result.data.history_amount}金币`);
                            await this.sleepDone(result.data.history_amount)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】结束睡眠: ${result.err_tips}`)
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
    async sleepDone(amount,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/sleep?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{"done_type":"end_sleep"}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】领取睡金: 获得奖励 ${amount} 金币`);
                            await this.sleepDone(result.data.history_amount)
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
    async sleep_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v2/task/done/sleep_ad?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
                body: `{"from":"sleep_watching_ad","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】睡眠广告: 获得奖励 ${result.data.amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】睡眠广告: ${result.err_tips}`)
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
    async music(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v2/task/page?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'User-Agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            if(result.data.task_list && Array.isArray(result.data.task_list)) {
                                for(let i=0; i < result.data.task_list.length; i++) {
                                    let taskItem = result.data.task_list[i];
                                    if (taskItem.task_id == "10001") {
                                        if(taskItem.is_completed == true) {
                                            DoubleLog(`\n ❌ 【${this.index}】听歌赚钱: 今日${taskItem.action_times}次听歌已达上限，请明日再来`)
                                        } else {
                                            let tasklist = JSON.parse(taskItem.extra);
                                            for (let statusextra of tasklist) {
                                                if(statusextra.is_completed == false) {
                                                    await this.open_music(statusextra.task_key,2 * 1000);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    if (taskItem.task_id == "25") {
                                        if(taskItem.is_completed == true) {
                                            DoubleLog(`\n ❌ 【${this.index}】听歌签到: 今日听歌已签到，请明日再来`)
                                        } else {
                                            await this.music_signin(2 * 1000);
                                        }
                                    }
                                }
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】听歌赚钱: 没有找到任务相关列表`)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】听歌赚钱: ${result.err_tips}`)
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
    async open_music(taskkey,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/${taskkey}?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json; charset=utf-8',
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
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
                            DoubleLog(`\n ✅ 【${this.index}】听歌奖励: 获得奖励 ${result.data.amount} 金币,广告预计${result.data.excitation_ad_read.score_amount}金币`);
                            await this.open_music_video(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】听歌奖励: ${result.err_tips}`)
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
    async open_music_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_read?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json; charset=utf-8',
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"from":"listen_task","position":"","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】听歌奖励: 获得奖励 ${result.data.amount} 金币`);
                            await $.wait(30000);
                            await this.music_video_status(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】听歌奖励: ${result.err_tips}`)
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
    async music_video_status(num,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_read?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json; charset=utf-8',
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】听歌追加: 第 ${num} 次追加获得奖励 ${result.data.amount} 金币`);
                            await $.wait(30000);
                            await this.music_video_status(2 * 1000);
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
    async music_signin(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/music_continue_signin?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json; charset=utf-8',
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
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
                            DoubleLog(`\n ✅ 【${this.index}】听歌签到: 获得 ${result.data.amount} 金币,广告预计${result.data.excitation_ad.score_amount}金币`);
                            await $.wait(30000);
                            await this.music_signin_video(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】听歌签到: ${result.err_tips}`)
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
    async music_signin_video(num,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_listen_music?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json; charset=utf-8',
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"from":"listen_music_task","position":"","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】听歌广告: 第 ${num} 次追加获得奖励 ${result.data.amount} 金币`);
                            await $.wait(30000);
                            await this.music_signin_video(2 * 1000);
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
    async lottery(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/lottery/page?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
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
                            if(result.data.continue_lottery_data.today_completed == true) {
                                DoubleLog(`\n ❌ 【${this.index}】连续抽奖: 今天已抽奖，已连续抽奖 ${result.data.continue_lottery_data.lottery_days} 天`)
                            } else {
                                await this.open_lottery_signin(2 * 1000);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱抽奖: ${result.err_tips}`)
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
    async open_lottery_signin(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/lottery/continue_lottery?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json; charset=utf-8',
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
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
                            DoubleLog(`\n ✅ 【${this.index}】抽奖签到: 获得 ${result.data.amount} 金币,广告预计${result.data.excitation_ad.score_amount}金币`);
                            await this.open_lottery_video(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】抽奖签到: ${result.err_tips}`)
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
    async open_lottery_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_continue_lottery?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json; charset=utf-8',
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"from":"gold_everyday_lottery","position":"","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】抽奖奖励: 获得奖励 ${result.data.amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】抽奖奖励: ${result.err_tips}`)
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
    async lottery_reward(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/lottery/page?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
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
                            if (result.data.today_completed == true) {
                                DoubleLog(`\n ❌ 【${this.index}】天天抽奖: 今日机会已用完，请明天再来吧。`)
                            } else {
                                await this.open_lottery_reward(2 * 1000);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】天天抽奖: ${result.err_tips}`)
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
    async open_lottery_reward(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/lottery/do_lottery?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json; charset=utf-8',
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
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
                            DoubleLog(`\n ✅ 【${this.index}】抽奖签到: 获得奖励 ${result.data.amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】抽奖签到: ${result.err_tips}`)
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
    async readbook(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/list?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            if(result.data.task_list.daily && Array.isArray(result.data.task_list.daily)) {
                                for(let i=0; i < result.data.task_list.daily.length; i++) {
                                    let taskItem = result.data.task_list.daily[i];
                                    if (taskItem.is_completed == false) {
                                        await this.open_readbook(taskItem.task_key,2 * 1000);
                                        break;
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币红包: ${result.err_tips}`)
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
    async open_readbook(taskkey,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/daily_read?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"task_key":"${taskkey}"}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】听书奖励: 获得奖励 ${result.data.amount} 金币`);
                            await this.readbook_video(2 * 1000);
                            await $.wait(5000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】听书奖励: ${result.err_tips}`)
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
    async readbook_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_read?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"from":"listen_task","position":"","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】听书广告: 获得奖励 ${result.data.amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】听书广告: ${result.err_tips}`)
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
    async listening(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v2/task/page?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            if(result.data.task_list_v2 && Array.isArray(result.data.task_list_v2)) {
                                for(let i=0; i < result.data.task_list_v2.length; i++) {
                                    let taskItem = result.data.task_list_v2[i];
                                    if(taskItem.task_id == "10005") {
                                        let extra = JSON.parse(taskItem.extra);
                                        if (taskItem.is_completed == true) {
                                            DoubleLog(`\n ❌ 【${this.index}】听书赚钱: 今日已达上限，请明日再来`)
                                        } else {
                                            for(let i=0; i < extra.length; i++) {
                                                let taskist = extra[i];
                                                if (taskist.is_completed == false) {
                                                    await this.open_listening(taskist.task_key,2 * 1000);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】金币红包: ${result.err_tips}`)
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
    async open_listening(taskkey,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/${taskkey}?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
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
                            DoubleLog(`\n ✅ 【${this.index}】阅读奖励: 获得奖励 ${result.data.amount} 金币`);
                            await this.listening_video(2 * 1000);
                            await $.wait(5000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】阅读奖励: ${result.err_tips}`)
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
    async listening_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novelfm_vest/v1/task/done/excitation_ad_daily_read?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Connection': 'keep-alive',
				    'Content-Type': 'application/json; charset=utf-8',
                    'X-Khronos': times,
                    'x-ss-req-ticket': timestamp,
				    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
                },
                body: `{"from":"read_merge","position":"","reward_stage":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】阅读广告: 获得奖励 ${result.data.amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】阅读广告: ${result.err_tips}`)
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
    async queryFarmSignStatus(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/sign_in/list?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            for (let item of result.data.sign) {
                                if (item.status == 1) {
                                    await this.farmSign(2 * 1000);
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场签到: ${result.message}`)
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
    async farmSign(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/reward/sign_in?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            let str = (result.data.reward_type == 1) ? '水滴' : '化肥'
                            DoubleLog(`\n ✅ 【${this.index}】农场签到: 获得：${result.data.reward_num}${str}，剩余${str}数量${result.data.cur_reward_num}`);
                            await this.farmSignDouble(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场签到: ${result.message}`)
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
    async farmSignDouble(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/reward/double_sign_in?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            let str = (result.data.reward_type == 1) ? '水滴' : '化肥'
                            DoubleLog(`\n ✅ 【${this.index}】签到翻倍: 获得：${result.data.reward_num}${str}，剩余${str}数量${result.data.cur_reward_num}`);
                            await this.farmSignDouble(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到翻倍: ${result.message}`)
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
    async queryFarmInfo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/polling_info?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            //console.log(result.data)
                            //DoubleLog(`\n ✅ 【${this.index}】农场状态: 离线产量翻倍成功`);
                            if (result.data.info.offline_production) {
                                await this.farmOfflineDouble(2 * 1000)
                            }
                            if (result.data.info.water >= 10) {
                                await this.farmWater(2 * 1000)
                            }
                            if (result.data.info.box_num > 0) {
                                await this.farmOpenBox(2 * 1000)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场状态: ${result.message}`)
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
    async queryFarmLandStatus(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/home_info?aid=35&enter_from=bottom&channel=lite_xiaomi_64&static_settings_version=49&device_type=${this.device_type}&language=zh&ab_client=a1%2Ce1%2Cf2%2Cg2%2Cf7&resolution=1080*2131&update_version_code=${this.update_version_code}&cdid=${this.cdid}&ab_group=z2&abflag=3&dynamic_settings_version=49&ac=wifi&device_id=${this.device_id}&version_code=${this.version_code}&luckydog_api_version=8.2.0-rc.14&ab_version=668906%2C6042544%2C668904%2C6042527%2C668908%2C6042572%2C668776%2C6042565%2C1859937%2C668905%2C6042536%2C668903%2C6042562%2C668907%2C6042568%2C5315659%2C6070342%2C4743964%2C6142135&luckydog_base=-QidAP-ibJV6f9apmrP0glb9BONRnY-WY1afPEPyoUUDtXN4nP69EvWHeEMEGdVTaWbFdbA-DsfV2PheIspa3ainEWyPtkZKU3UO-zS06HGvoD-6O4yGpntufzqTaBXmXWUjcREyQoWJJRMoUuGQ3b6DH6xYgoAs6U9yQEQK1uLVf69-gQ_OXdYjiAudo3DC&scm_build_version=1.0.1.1339&plugin_state=821344778461205&device_platform=android&aid=${this.aid}&rom_version=${this.rom_version}&manifest_version_code=9290&_rticket=${timestamp}&iid=${this.iid}&isTTWebView=0&host_abi=arm64-v8a&is_pad=0&dq_param=0&status_bar_height=29&os_api=${this.os_api}&luckydog_data=ySLgwrbhgjs__UB8DkE507kivUn975bkCrKIZE5P6_-rTg0X_4qHxsa15teJ7ySP49_h1qjQi5tNPQhM9yRrhdM55fkXYev06Z1Me9urSeg&dpi=440&ab_feature=z1&polling_settings_version=0&os=android&pass_through=null&os_version=${this.os_version}&session_id=${this.session_id}&luckydog_token=E7D_IvLA-Q8He2pDxx-ZQcTk7cYlIDUUMrO7ZnyY9JYMGAufDFo5Xe9o-7EfFcdE&tma_jssdk_version=2.53.0&app_name=news_article_lite&version_name=${this.version_name}&device_brand=${this.device_brand}&ssmix=a&luckydog_sdk_version=8.2.0-rc.14&polaris_version=1.0.5&luckycat_version_name=8.2.0-rc.14&luckycat_version_code=820014&lucky_is_32=0&lucky_device_score=7.8626&lucky_device_type=${this.device_type}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            for (let item of result.data.info.lands) {
                                if (item.status == false && item.unlock_able == true) {
                                    await this.farmUnlock(item.land_id)
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】土地状态: ${result.message}`)
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
    async farmUnlock(land_id,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/land/unlock?land_id=${land_id}&aid=35&enter_from=bottom&channel=lite_xiaomi_64&static_settings_version=49&device_type=${this.device_type}&language=zh&ab_client=a1%2Ce1%2Cf2%2Cg2%2Cf7&resolution=1080*2131&update_version_code=${this.update_version_code}&cdid=${this.cdid}&ab_group=z2&abflag=3&dynamic_settings_version=49&ac=wifi&device_id=${this.device_id}&version_code=${this.version_code}&luckydog_api_version=8.2.0-rc.14&ab_version=668906%2C6042544%2C668904%2C6042527%2C668908%2C6042572%2C668776%2C6042565%2C1859937%2C668905%2C6042536%2C668903%2C6042562%2C668907%2C6042568%2C5315659%2C6070342%2C4743964%2C6142135&luckydog_base=-QidAP-ibJV6f9apmrP0glb9BONRnY-WY1afPEPyoUUDtXN4nP69EvWHeEMEGdVTaWbFdbA-DsfV2PheIspa3ainEWyPtkZKU3UO-zS06HGvoD-6O4yGpntufzqTaBXmXWUjcREyQoWJJRMoUuGQ3b6DH6xYgoAs6U9yQEQK1uLVf69-gQ_OXdYjiAudo3DC&scm_build_version=1.0.1.1339&plugin_state=821344778461205&device_platform=android&aid=${this.aid}&rom_version=${this.rom_version}&manifest_version_code=9290&_rticket=${timestamp}&iid=${this.iid}&isTTWebView=0&host_abi=arm64-v8a&is_pad=0&dq_param=0&status_bar_height=29&os_api=${this.os_api}&luckydog_data=ySLgwrbhgjs__UB8DkE507kivUn975bkCrKIZE5P6_-rTg0X_4qHxsa15teJ7ySP49_h1qjQi5tNPQhM9yRrhdM55fkXYev06Z1Me9urSeg&dpi=440&ab_feature=z1&polling_settings_version=0&os=android&pass_through=null&os_version=${this.os_version}&session_id=${this.session_id}&luckydog_token=E7D_IvLA-Q8He2pDxx-ZQcTk7cYlIDUUMrO7ZnyY9JYMGAufDFo5Xe9o-7EfFcdE&tma_jssdk_version=2.53.0&app_name=news_article_lite&version_name=${this.version_name}&device_brand=${this.device_brand}&ssmix=a&luckydog_sdk_version=8.2.0-rc.14&polaris_version=1.0.5&luckycat_version_name=8.2.0-rc.14&luckycat_version_code=820014&lucky_is_32=0&lucky_device_score=7.8626&lucky_device_type=${this.device_type}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】解锁土地: 成功解锁 ${land_id} 号土地`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】解锁土地: ${result.message}`)
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
    async queryFarmTask(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/daily_task/list?aid=35&enter_from=bottom&channel=lite_xiaomi_64&static_settings_version=49&device_type=${this.device_type}&language=zh&ab_client=a1%2Ce1%2Cf2%2Cg2%2Cf7&resolution=1080*2131&update_version_code=${this.update_version_code}&cdid=${this.cdid}&ab_group=z2&abflag=3&dynamic_settings_version=49&ac=wifi&device_id=${this.device_id}&version_code=${this.version_code}&luckydog_api_version=8.2.0-rc.14&ab_version=668906%2C6042544%2C668904%2C6042527%2C668908%2C6042572%2C668776%2C6042565%2C1859937%2C668905%2C6042536%2C668903%2C6042562%2C668907%2C6042568%2C5315659%2C6070342%2C4743964%2C6142135&luckydog_base=-QidAP-ibJV6f9apmrP0glb9BONRnY-WY1afPEPyoUUDtXN4nP69EvWHeEMEGdVTaWbFdbA-DsfV2PheIspa3ainEWyPtkZKU3UO-zS06HGvoD-6O4yGpntufzqTaBXmXWUjcREyQoWJJRMoUuGQ3b6DH6xYgoAs6U9yQEQK1uLVf69-gQ_OXdYjiAudo3DC&scm_build_version=1.0.1.1339&plugin_state=821344778461205&device_platform=android&aid=${this.aid}&rom_version=${this.rom_version}&manifest_version_code=9290&_rticket=${timestamp}&iid=${this.iid}&isTTWebView=0&host_abi=arm64-v8a&is_pad=0&dq_param=0&status_bar_height=29&os_api=${this.os_api}&luckydog_data=ySLgwrbhgjs__UB8DkE507kivUn975bkCrKIZE5P6_-rTg0X_4qHxsa15teJ7ySP49_h1qjQi5tNPQhM9yRrhdM55fkXYev06Z1Me9urSeg&dpi=440&ab_feature=z1&polling_settings_version=0&os=android&pass_through=null&os_version=${this.os_version}&session_id=${this.session_id}&luckydog_token=E7D_IvLA-Q8He2pDxx-ZQcTk7cYlIDUUMrO7ZnyY9JYMGAufDFo5Xe9o-7EfFcdE&tma_jssdk_version=2.53.0&app_name=news_article_lite&version_name=${this.version_name}&device_brand=${this.device_brand}&ssmix=a&luckydog_sdk_version=8.2.0-rc.14&polaris_version=1.0.5&luckycat_version_name=8.2.0-rc.14&luckycat_version_code=820014&lucky_is_32=0&lucky_device_score=7.8626&lucky_device_type=${this.device_type}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            for (let item of result.data) {
                                if (item.status == 1) {
                                    await this.rewardFarmTask(item.task_id);
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场任务: ${result.message}`)
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
    async rewardFarmTask(id,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/reward/task?task_id=${id}&aid=35&enter_from=bottom&channel=lite_xiaomi_64&static_settings_version=49&device_type=${this.device_type}&language=zh&ab_client=a1%2Ce1%2Cf2%2Cg2%2Cf7&resolution=1080*2131&update_version_code=${this.update_version_code}&cdid=${this.cdid}&ab_group=z2&abflag=3&dynamic_settings_version=49&ac=wifi&device_id=${this.device_id}&version_code=${this.version_code}&luckydog_api_version=8.2.0-rc.14&ab_version=668906%2C6042544%2C668904%2C6042527%2C668908%2C6042572%2C668776%2C6042565%2C1859937%2C668905%2C6042536%2C668903%2C6042562%2C668907%2C6042568%2C5315659%2C6070342%2C4743964%2C6142135&luckydog_base=-QidAP-ibJV6f9apmrP0glb9BONRnY-WY1afPEPyoUUDtXN4nP69EvWHeEMEGdVTaWbFdbA-DsfV2PheIspa3ainEWyPtkZKU3UO-zS06HGvoD-6O4yGpntufzqTaBXmXWUjcREyQoWJJRMoUuGQ3b6DH6xYgoAs6U9yQEQK1uLVf69-gQ_OXdYjiAudo3DC&scm_build_version=1.0.1.1339&plugin_state=821344778461205&device_platform=android&aid=${this.aid}&rom_version=${this.rom_version}&manifest_version_code=9290&_rticket=${timestamp}&iid=${this.iid}&isTTWebView=0&host_abi=arm64-v8a&is_pad=0&dq_param=0&status_bar_height=29&os_api=${this.os_api}&luckydog_data=ySLgwrbhgjs__UB8DkE507kivUn975bkCrKIZE5P6_-rTg0X_4qHxsa15teJ7ySP49_h1qjQi5tNPQhM9yRrhdM55fkXYev06Z1Me9urSeg&dpi=440&ab_feature=z1&polling_settings_version=0&os=android&pass_through=null&os_version=${this.os_version}&session_id=${this.session_id}&luckydog_token=E7D_IvLA-Q8He2pDxx-ZQcTk7cYlIDUUMrO7ZnyY9JYMGAufDFo5Xe9o-7EfFcdE&tma_jssdk_version=2.53.0&app_name=news_article_lite&version_name=${this.version_name}&device_brand=${this.device_brand}&ssmix=a&luckydog_sdk_version=8.2.0-rc.14&polaris_version=1.0.5&luckycat_version_name=8.2.0-rc.14&luckycat_version_code=820014&lucky_is_32=0&lucky_device_score=7.8626&lucky_device_type=${this.device_type}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            let typeStr = (result.data.reward_type == 1) ? '水滴' : '化肥'
                            DoubleLog(`\n ✅ 【${this.index}】农场任务: 奖励[${result.data.task_id}]获得${result.data.reward_num}${typeStr}，剩余${typeStr}数量${result.data.current_num}`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场任务: ${result.message}`)
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
    async farmOfflineDouble(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/double_reward?watch_ad=1&aid=35&enter_from=bottom&channel=lite_xiaomi_64&static_settings_version=49&device_type=${this.device_type}&language=zh&ab_client=a1%2Ce1%2Cf2%2Cg2%2Cf7&resolution=1080*2131&update_version_code=${this.update_version_code}&cdid=${this.cdid}&ab_group=z2&abflag=3&dynamic_settings_version=49&ac=wifi&device_id=${this.device_id}&version_code=${this.version_code}&luckydog_api_version=8.2.0-rc.14&ab_version=668906%2C6042544%2C668904%2C6042527%2C668908%2C6042572%2C668776%2C6042565%2C1859937%2C668905%2C6042536%2C668903%2C6042562%2C668907%2C6042568%2C5315659%2C6070342%2C4743964%2C6142135&luckydog_base=-QidAP-ibJV6f9apmrP0glb9BONRnY-WY1afPEPyoUUDtXN4nP69EvWHeEMEGdVTaWbFdbA-DsfV2PheIspa3ainEWyPtkZKU3UO-zS06HGvoD-6O4yGpntufzqTaBXmXWUjcREyQoWJJRMoUuGQ3b6DH6xYgoAs6U9yQEQK1uLVf69-gQ_OXdYjiAudo3DC&scm_build_version=1.0.1.1339&plugin_state=821344778461205&device_platform=android&aid=${this.aid}&rom_version=${this.rom_version}&manifest_version_code=9290&_rticket=${timestamp}&iid=${this.iid}&isTTWebView=0&host_abi=arm64-v8a&is_pad=0&dq_param=0&status_bar_height=29&os_api=${this.os_api}&luckydog_data=ySLgwrbhgjs__UB8DkE507kivUn975bkCrKIZE5P6_-rTg0X_4qHxsa15teJ7ySP49_h1qjQi5tNPQhM9yRrhdM55fkXYev06Z1Me9urSeg&dpi=440&ab_feature=z1&polling_settings_version=0&os=android&pass_through=null&os_version=${this.os_version}&session_id=${this.session_id}&luckydog_token=E7D_IvLA-Q8He2pDxx-ZQcTk7cYlIDUUMrO7ZnyY9JYMGAufDFo5Xe9o-7EfFcdE&tma_jssdk_version=2.53.0&app_name=news_article_lite&version_name=${this.version_name}&device_brand=${this.device_brand}&ssmix=a&luckydog_sdk_version=8.2.0-rc.14&polaris_version=1.0.5&luckycat_version_name=8.2.0-rc.14&luckycat_version_code=820014&lucky_is_32=0&lucky_device_score=7.8626&lucky_device_type=${this.device_type}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】农场离线: 离线产量翻倍成功`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场离线: ${result.message}`)
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
    async farmWater(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/land_water?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】浇水成功: 剩余：${result.data.water} 水滴`);
                            if (result.data.water >= 10) {
                                await $.wait(1500) //min time 1000
                                await this.farmWater(2 * 1000)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场浇水: ${result.message}`)
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
    async farmOpenBox(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/box/open?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】农场宝箱: 获得：${result.data.incr_coin} 金币`);
                            if (result.data.excitation_ad_score_amount > 0) {
                                await this.farmOpenBoxVideo(2 * 1000)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场宝箱: ${result.message}`)
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
    async farmOpenBoxVideo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_farm/excitation_ad/add?excitation_ad_score_amount=134&${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                    'user-agent': this.ck[4],
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${this.gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱视频: 获得：${result.data.incr_coin} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: ${result.message}`)
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
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_dyjsb.js`,
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
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            let obj = JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }
        } catch(e) {
            return false;
        }
    }
    console.log(`\n ❌ 温馨提示：很遗憾金币溜走了，继续尝试...`);
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
function getTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear(),
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
        D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()),
        h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()),
        m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()),
        s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return h + ':' + m + ':' + s
}
// ============================================结束项目所需参数============================================ \\
function DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `${data}` } } else { console.log(`${data}`); msg += `${data}` } }
async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, '', message) } } else { console.log(message) } }
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

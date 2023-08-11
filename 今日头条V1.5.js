/**
 * 
 * 项目类型：APP
 * 项目名称：今日头条
 * 项目更新：2023-08-04
 * 项目抓包：抓api5-normal-lq.toutiaoapi.com下的url#cookie#x-argus#x-ladon#user-agent填入变量
 * 项目变量：lekebo_jrtt_Cookie
 * 项目定时：每30分钟运行一次
 * 定时规则: 10 7-22 * * *   （多账号建议为2个小时运行一次，单账号为1小时一次更皆）
 * 版本功能: 签到、宝箱、广告、步数、吃饭、睡觉、阅读，后期会完善待增加的功能
 * 项目收入：如果单账号奖励低于100金，请自行活跃一下账号，如果单次运行高于100金证明账号正常。一天正常为3-4元
 * 
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */


const $ = new Env("今日头条");
//-------------------- 一般不动变量区域 -------------------------------------
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 0;		      //通知设置      0关闭  1开启
let debug = 0;                //Debug调试     0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';            //let ck,msg
let versionupdate = "0";      //版本对比升级   0关闭  1开启
//===============脚本版本=================//
let scriptVersion = "v1.5";
let update_tines = "2023-08-04";
let update_data = "2024-07-25";   //测试时间
let scriptVersionLatest = "v1.5"; //版本对比
let userCookie = ($.isNode() ? process.env.lekebo_jrtt_Cookie : $.getdata('lekebo_jrtt_Cookie')) || '';
let userList = [];
let userIdx = 0;
let date = require('silly-datetime');
let signTime = date.format(new Date(),'YYYY-MM-DD');
let curTime = new Date();
let curHour = curTime.getHours();
let times = Math.round(new Date().getTime() / 1000).toString();
let timestamp = Math.round(new Date().getTime()).toString();
let host = 'api5-normal-lq.toutiaoapi.com';
let hostname = 'https://' + host;
//---------------------- 自定义变量区域 -----------------------------------
async function start() {
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
        taskall.push(await user.signin_video(2 * 1000));
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行账号走路赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.step(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.step_video(2 * 1000));
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行账号吃饭赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.doneeat(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.doneeat_video(2 * 1000));
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行账号睡觉赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.sleepstart(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.sleep_video(2 * 1000));
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行开宝箱赚金币 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.treasure(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.treasure_video(2 * 1000));
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行看广告赚金币 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.video(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.advideo(2 * 1000));
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行阅读文章赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.news(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行小说签到赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.novelsignin(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    // DoubleLog(`\n================ 执行小说签到赚金 ================`)
    // taskall = [];
    // for (let user of userList) {
    //     taskall.push(await user.open_news_status(2 * 1000));
    //     await $.wait(1000);
    // }
    // await Promise.all(taskall);
}

class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split('#');
        this.numvodie = '30';
        this.numamount = '50';
    }
// ============================================执行项目============================================ \\
    async getMemberScore(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/take_cash/take_cash_page?${this.ck[0]}`,
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
                            let score = result['data']["take_cash_info"]["user_income"]["score_balance"]
                            let cash = result["data"]["take_cash_info"]["user_income"]["cash_balance"] / 100
                            DoubleLog(`\n ✅ 【${this.index}】收益状况: 今天收入:${score}金币,现金:${cash}元`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】收益状况: ${result.err_tips}`)
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
                url: `${hostname}/luckycat/news/v1/task/page?${this.ck[0]}`,
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
                            if (result.data.signin_detail.today_signed == true) {
                                DoubleLog(`\n ❌ 【${this.index}】签到信息: 今天已签到，已连续签到 ${result.data.signin_detail.days} 天`);
                            } else {
                                await this.open_signin(2 * 1000);
                            }
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
    async open_signin(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/sign_in/done_task?${this.ck[0]}`,
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
                            DoubleLog(`\n ✅ 【${this.index}】签到信息: 获得 ${result["data"]["score_amount"]} 金币`)
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
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"ad_id":1,"amount":1200,"ad_rit":"1","task_key":"excitation_ad\/","task_id":187,"ad_alias_position":"task","is_post_login":false,"ad_from":"coin","score_source":0,"coin_count":1200,"params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let num = Number(this.numvodie);
                            for (let i = 0; i < num; i=i+1) {
                                if (result.err_no == 4) {
                                    DoubleLog(`\n ❌ 【${this.index}】签到视频: ${result.err_tips}`);
                                    break;
                                } else if (result.data.reward_amount < this.numamount) {
                                    DoubleLog(`\n ✅ 【${this.index}】签到视频: 获得奖励 ${result.data.reward_amount} 金币，收入低停止执行`);
                                    break;
                                } else {
                                    await this.signin_video_stop(2 * 1000);
                                    await $.wait(30000);
                                }
                                if (i == num) {
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
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"ad_id":1,"amount":1200,"ad_rit":"1","task_key":"excitation_ad\/","task_id":187,"ad_alias_position":"task","is_post_login":false,"ad_from":"coin","score_source":0,"coin_count":1200,"params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】签到视频: 获得奖励 ${result.data.reward_amount} 金币`);
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
    async treasure(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/task/page?${this.ck[0]}`,
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
                            let next_time = result.data.treasure.next_treasure_time;
                            let cur_time = result.data.treasure.current_time;
                            if (next_time <= cur_time) {
                                await this.open_treasure(2 * 1000);
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】打开宝箱: 下次开宝箱：${$.time('yyyy-MM-dd HH:mm:ss', next_time * 1000)}`)
                            }
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
    async open_treasure(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/treasure/open_treasure_box?${this.ck[0]}`,
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
                            DoubleLog(`\n ✅ 【${this.index}】打开宝箱: 获得 ${result.data.score_amount} 金币`);
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
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"amount":1200,"weight":0,"task_id":188,"is_post_login":false,"ad_from":"task","score_source":0,"content":"","ad_id":2,"ad_rit":"2","score_amount":1200,"task_key":"excitation_ad\/","extra":{"task_name":"","track_id":"","stage_score_amount":[],"task_id":""},"image_url_light":"","image_url_button":"","ad_alias_position":"task","fixed":false,"image_url_coin":"","coin_count":1200,"params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let num = Number(this.numvodie);
                            for (let i = 0; i < num; i=i+1) {
                                if (result.err_no == 4) {
                                    DoubleLog(`\n ❌ 【${this.index}】宝箱视频: ${result.err_tips}`);
                                    break;
                                } else if (result.data.reward_amount < this.numamount) {
                                    DoubleLog(`\n ✅ 【${this.index}】宝箱视频: 获得奖励 ${result.data.reward_amount} 金币，收入低停止执行`);
                                    break;
                                } else {
                                    await this.treasure_video_stop(2 * 1000);
                                    await $.wait(30000);
                                }
                                if (i == num) {
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
    async treasure_video_stop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"amount":1200,"weight":0,"task_id":188,"is_post_login":false,"ad_from":"task","score_source":0,"content":"","ad_id":2,"ad_rit":"2","score_amount":1200,"task_key":"excitation_ad\/","extra":{"task_name":"","track_id":"","stage_score_amount":[],"task_id":""},"image_url_light":"","image_url_button":"","ad_alias_position":"task","fixed":false,"image_url_coin":"","coin_count":1200,"params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱视频: 获得奖励 ${result.data.reward_amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱视频: ${result.err_tips}`);
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
                url: `${hostname}/luckycat/news/v1/task/page?${this.ck[0]}`,
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
                            if(result.data.task_list.daily && Array.isArray(result.data.task_list.daily)) {
                                for(let i=0; i < result.data.task_list.daily.length; i++) {
                                    let taskItem = result.data.task_list.daily[i];
                                    if (taskItem.task_id === 210) {
                                        if (taskItem.is_completed == true) {
                                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: ${taskItem.desc}`);
                                        } else {
                                            let action_times = taskItem.action_times;
                                            let extra = JSON.parse(taskItem.extra);
                                            let statusextra = JSON.parse(taskItem.status_extra);
                                            if (extra.left_seconds > 0) {
                                                DoubleLog(`\n ❌ 【${this.index}】广告赚金: 距离下次看广告：${$.time('mm:ss', extra.left_seconds * 1000)} 分钟`)
                                            } else {
                                                if (action_times >= statusextra.user_complete_count) {
                                                    DoubleLog(`\n ✅ 【${this.index}】广告赚金: 每天可完成10次, 已完成 ${statusextra.user_complete_count}/${action_times} 次`);
                                                    await this.open_video(2 * 1000);
                                                } else {
                                                    DoubleLog(`\n ❌ 【${this.index}】广告赚金: ${result.err_tips}`);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: ${result.err_tips}`)
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
                url: `${hostname}/luckycat/gip/v1/cooperate/exciad/done?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":210,"exci_extra":{"cid":1719921768928264,"req_id":"202307171737144C5FDA7548234D21B9D3","rit":80047},"extra":{"stage_score_amount":[],"track_id":"","draw_score_amount":null,"draw_track_id":null,"task_id":"","task_name":"","enable_fuzzy_amount":false,"custom_id":null}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】广告赚金: 获得奖励 ${result.data.reward_amount} 金币`);
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
    async advideo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/gip/v1/cooperate/exciad/done?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":225,"exci_extra":{"cid":1719921768928264,"req_id":"202307171737144C5FDA7548234D21B9D3","rit":80047},"extra":{"stage_score_amount":[],"track_id":"","draw_score_amount":null,"draw_track_id":null,"task_id":"","task_name":"","enable_fuzzy_amount":false,"custom_id":null}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let num = Number(this.numvodie);
                            for (let i = 0; i < num; i=i+1) {
                                if (result.err_no == 4) {
                                    DoubleLog(`\n ❌ 【${this.index}】激励广告: ${result.err_tips}`);
                                    break;
                                } else if (result.data.reward_amount < this.numamount) {
                                    DoubleLog(`\n ✅ 【${this.index}】激励广告: 获得奖励 ${result.data.reward_amount} 金币，收入低停止执行`);
                                    break;
                                } else {
                                    await this.advideo_stop(2 * 1000);
                                    await $.wait(30000);
                                }
                                if (i == num) {
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
    async advideo_stop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/gip/v1/cooperate/exciad/done?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":225,"exci_extra":{"cid":1719921768928264,"req_id":"202307171737144C5FDA7548234D21B9D3","rit":80047},"extra":{"stage_score_amount":[],"track_id":"","draw_score_amount":null,"draw_track_id":null,"task_id":"","task_name":"","enable_fuzzy_amount":false,"custom_id":null}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】激励广告: 获得奖励 ${result.data.reward_amount} 金币`);
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
                url: `${hostname}/luckycat/news/v1/walk/count?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"count":${parseInt((10000 + Math.random() * 10000) + "")},"client_time":${times}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】上传步数: 获得 ${result["data"]["score_amount"]} 金币`);
                            await this.open_step(2 * 1000);
                        } else if (result.err_no == 80050269) {
                            DoubleLog(`\n ❌ 【${this.index}】上传步数: 今天已上传 ${result.data.walk_count} 步，不允许更新步数`);
                        } else if (result.err_no == 9) {
                            DoubleLog(`\n ❌ 【${this.index}】上传步数: 今天已上传 ${result.data.walk_count} 步，请勿重复执行。`);
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
    async open_step(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/walk/done_task?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":136,"client_time":${timestamp},"rit":"","use_ecpm":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】步数奖励: 获得 ${result.data.score_amount} 金币`);
                        }else if (result.err_no == 9) {
                            DoubleLog(`\n ✅ 【${this.index}】步数奖励: 系统检测设备存在异常，设备黑无法领取`)
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
    async step_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":190,"score_source":0,"ad_id":4,"ad_from":"coin","amount":1200,"coin_count":1200,"ad_alias_position":"task","ad_rit":4,"task_key":"excitation_ad\/","params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let num = Number(this.numvodie);
                            for (let i = 0; i < num; i=i+1) {
                                if (result.err_no == 4) {
                                    DoubleLog(`\n ❌ 【${this.index}】步数视频: ${result.err_tips}`);
                                    break;
                                } else if (result.data.reward_amount < this.numamount) {
                                    DoubleLog(`\n ✅ 【${this.index}】步数视频: 获得奖励 ${result.data.reward_amount} 金币，收入低停止执行`);
                                    break;
                                } else {
                                    await this.step_video_stop(2 * 1000);
                                    await $.wait(30000);
                                }
                                if (i == num) {
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】步数视频: ${result.err_tips}`);
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
    async step_video_stop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":190,"score_source":0,"ad_id":4,"ad_from":"coin","amount":1200,"coin_count":1200,"ad_alias_position":"task","ad_rit":4,"task_key":"excitation_ad\/","params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】步数视频: 获得奖励 ${result.data.reward_amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】步数视频: ${result.err_tips}`);
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
                            DoubleLog(`\n ✅ 【${this.index}】吃饭奖励: 获得 ${result.data.score_amount} 金币`)
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
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":181,"score_source":0,"ad_id":5,"ad_from":"coin","amount":1200,"coin_count":1200,"ad_alias_position":"task","ad_rit":5,"task_key":"excitation_ad\/","params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let num = Number(this.numvodie);
                            for (let i = 0; i < num; i=i+1) {
                                if (result.err_no == 4) {
                                    DoubleLog(`\n ❌ 【${this.index}】吃饭视频: ${result.err_tips}`);
                                    break;
                                } else if (result.data.reward_amount < this.numamount) {
                                    DoubleLog(`\n ✅ 【${this.index}】吃饭视频: 获得奖励 ${result.data.reward_amount} 金币，收入低停止执行`);
                                    break;
                                } else {
                                    await this.doneeat_video_stop(2 * 1000);
                                    await $.wait(30000);
                                }
                                if (i == num) {
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】步数视频: ${result.err_tips}`);
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
    async doneeat_video_stop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
				    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":181,"score_source":0,"ad_id":5,"ad_from":"coin","amount":1200,"coin_count":1200,"ad_alias_position":"task","ad_rit":5,"task_key":"excitation_ad\/","params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】吃饭视频: 获得奖励 ${result.data.reward_amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】吃饭视频: ${result.err_tips}`);
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
                                if (curHour >= 22 || curHour < 2) {
                                    await this.open_sleeps(2 * 1000)
                                } else if (curHour >= 20) {
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
    async sleep_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":189,"score_source":0,"ad_id":3,"ad_from":"coin","amount":1200,"coin_count":1200,"ad_alias_position":"task","ad_rit":3,"task_key":"excitation_ad\/","params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let num = Number(this.numvodie);
                            for (let i = 0; i < num; i=i+1) {
                                if (result.err_no == 4) {
                                    DoubleLog(`\n ❌ 【${this.index}】睡眠广告: ${result.err_tips}`);
                                    break;
                                } else if (result.data.reward_amount < this.numamount) {
                                    DoubleLog(`\n ✅ 【${this.index}】睡眠广告: 获得奖励 ${result.data.reward_amount} 金币，收入低停止执行`);
                                    break;
                                } else {
                                    await this.sleep_video_stop(2 * 1000);
                                    await $.wait(30000);
                                }
                                if (i == num) {
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】睡眠广告: ${result.err_tips}`);
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
    async sleep_video_stop(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/task/done/excitation_ad/?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"task_id":189,"score_source":0,"ad_id":3,"ad_from":"coin","amount":1200,"coin_count":1200,"ad_alias_position":"task","ad_rit":3,"task_key":"excitation_ad\/","params_for_special":"luckydog_sdk","static_settings_version":51,"dynamic_settings_version":51,"poll_settings_version":0}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】睡眠广告: 获得奖励 ${result.data.score_amount} 金币`);
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
    async news(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/activity/done_whole_scene_task?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"group_id":"","scene_key":"IndexTabFeed","is_golden_egg":true}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】阅读统计: 已赚 ${result.data.total_score_amount} 金，阅读时长 ${$.time('mm:ss', result.data.total_time * 1000)} 分钟`);
                            let num = Number(this.numvodie);
                            let newstime = result.data.total_time;
                            for (let i = 1; i < num; i=i+1) {
                                DoubleLog(`\n ✅ 【${this.index}】阅读文章: 正在第 ${i} 次阅读，请等待...`);
                                await $.wait(30000);
                                await this.open_news(2 * 1000);
                                if (i == 10) {
                                    await this.open_news_status(2 * 1000);
                                    break;
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】阅读文章: ${result.err_tips}`)
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
    async open_news(newstime,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/activity/done_whole_scene_task?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"group_id":"","scene_key":"IndexTabFeed","is_golden_egg":true}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            let totaltime = result.data.total_time - newstime;
                            DoubleLog(`\n ✅ 【${this.index}】阅读文章: 获得奖励 ${result.data.score_amount} 金币，阅读增加 ${$.time('ss', totaltime * 1000)} 秒`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】阅读文章: ${result.err_tips}`)
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
    async open_news_status(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/task/page?${this.ck[0]}`,
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
                            if(result.data.task_list.special && Array.isArray(result.data.task_list.special)) {
                                for(let i=0; i < result.data.task_list.special.length; i++) {
                                    let taskItem = result.data.task_list.special[i];
                                    if (taskItem.task_id === 333) {
                                        let statusextra = JSON.parse(taskItem.extra);
                                        let sextra = statusextra.extra_score_info.extra_score_amounts;
                                        if (sextra.seconds == 120) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(120,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 300) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(300,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 600) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(600,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 900) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(900,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 1200) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(1200,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 1800) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(1800,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 2700) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(2700,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 3600) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(3600,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 4500) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(4500,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 5400) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(5400,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 7200) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(7200,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 9000) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(9000,2 * 1000);
                                            }
                                        } else if (sextra.seconds == 10800) {
                                            if (sextra.score_amount > 0) {
                                                await this.open_news_stop(10800,2 * 1000);
                                            }
                                        } else {
                                            DoubleLog(`\n ❌ 【${this.index}】时段奖励: 没有可领取的时段奖励`)
                                        }
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】时段奖励: ${result.err_tips}`)
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
    async open_news_stop(seconds,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/news/v1/activity/done_whole_scene_extra_task?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"is_get_all":false,"progress_seconds":${seconds}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】时段奖励: 获得奖励 ${result.data.score_amount} 金币,时长${$.time('mm:ss', result.data.total_score_amount * 1000)}分钟`);
                        } else if (result.err_no == 8005007) {
                            DoubleLog(`\n ❌ 【${this.index}】时段奖励: 该时段已领取过奖励，不可重复领取哦`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】时段奖励: ${result.err_tips}`)
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
    async novelsignin(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/luckycat/novel_sdk/v1/task/done/sign_in?${this.ck[0]}`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/json; charset=utf-8',
				    'User-Agent': this.ck[4],
                    'Cookie': this.ck[1],
                    'x-argus': this.ck[2],
                    'x-ladon': this.ck[3],
                },
                body: `{"nameValuePairs":{}}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.err_no == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】小说签到: 获得奖励 ${result.data.amount} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】小说签到: ${result.err_tips}`)
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
    DoubleLog(`\n================ 本次运行脚本结束 ===============`);
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
        console.log("\n 乐客播提示：系统变量未填写 Token");
        return;
    }
    return true;
}
// ============================================获取远程版本============================================ \\
function getVersion(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_jrtt.js`,
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
// ============================================结束项目所需参数============================================ \\
function DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `${data}` } } else { console.log(`${data}`); msg += `${data}` } }
async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, '', message) } } else { console.log(message) } }
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

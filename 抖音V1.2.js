/**
 * 
 * 项目类型：APP
 * 项目名称：抖音
 * 项目更新：2023-08-05
 * 项目抓包：抓api26-normal-hl.amemv.com下的宝箱url#cookie#x-argus#x-ladon#user-agent填入变量
 * 项目变量：lekebo_dy_Cookie
 * 项目定时：每30分钟运行一次
 * 定时规则: 10 7-22 * * *
 * 
 * 版本功能: 签到、宝箱、广告、刷小视频、果树，后期会完善待增加的功能
 * 
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */

const $ = new Env("抖音");
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
let update_tines = "2023-08-05";
let update_data = "2023-12-12";   //测试时间
let scriptVersionLatest = "v1.2"; //版本对比
let userCookie = ($.isNode() ? process.env.lekebo_dy_Cookie : $.getdata('lekebo_dy_Cookie')) || '';
let userList = [];
let userIdx = 0;
let date = require('silly-datetime');
let signTime = date.format(new Date(),'YYYY-MM-DD');
let times = Math.round(new Date().getTime() / 1000).toString();  //10位时间戳
let timestamp = Math.round(new Date().getTime()).toString();     //13位时间戳
let host = 'api26-normal-hl.amemv.com';
let hostname = 'https://' + host;
//---------------------- 自定义变量区域 -----------------------------------
async function start() {
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.getMemberInfo(2 * 1000));
        await $.wait(1000);
        //taskall.push(await user.invitation(2 * 1000));
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
	DoubleLog(`\n================ 执行观看视频赚金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.doublevideo(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
	DoubleLog(`\n================ 执行农场果树种殖 ================`)
	taskall = [];
    for (let user of userList) {
        taskall.push(await user.microgame(2 * 1000));
        await $.wait(1000);
		taskall.push(await user.getInfo(2 * 1000));
		await $.wait(1000);
		taskall.push(await user.doSignin(2 * 1000));
		await $.wait(1000);
		taskall.push(await user.nutrientSignin(2 * 1000));
		await $.wait(1000);
		taskall.push(await user.getBottle(2 * 1000));       //收取水瓶
		await $.wait(1000);
		taskall.push(await user.getTask(2 * 1000));         //水滴
		await $.wait(1000);
		taskall.push(await user.getNutrientList(2 * 1000)); //肥料
		await $.wait(1000);
		taskall.push(await user.queryFarmThreeGift(2 * 1000)); //三餐
		await $.wait(1000);
		taskall.push(await user.egggift(2 * 1000));            //视频领水
		await $.wait(1000);
		taskall.push(await user.giveWater(2 * 1000));       //果树浇水
		await $.wait(1000);
		taskall.push(await user.chooseChallenge(2 * 1000)); //每日挑战
		await $.wait(1000);
		taskall.push(await user.fortunetree(2 * 1000));     //摇树
		await $.wait(1000);
		// taskall.push(await user.touchDuck(2 * 1000));       //戳鸭
    }
    await Promise.all(taskall);
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
                url: `${hostname}/aweme/v1/user/profile/self/?${this.ck[0]}`,
                headers: {
                    'Content-Type': 'application/json',
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】用户信息: ${result.user.bind_phone}，${result.user.nickname}`)
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
                url: `${hostname}/aweme/ughun/incentive/management_page/?launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】金币收益: 拥有：${result.data.gold_income_info.gold_balance} 金币，余额：${result.data.gold_income_info.gold_exchange_number} 元`)
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
                url: `${hostname}/aweme/ughun/incentive/management_page/?launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
							if(result.data.sign_in_info.today_signed == true) {
								DoubleLog(`\n ❌ 【${this.index}】签到信息: 今天已签到，已连续签到 ${result.data.sign_in_info.signed_days} 天`);
							} else {
								await this.open_signin(result.data.sign_in_info.token,2 * 1000);
							}
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到信息: ${result.data.message}`)
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
	async open_signin(treasuretoken,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/lottery/?${this.ck[0]}&request_tag_from=lynx&req_from=fe_sign_in&launch_method=enter_launch&token=${treasuretoken}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: ``,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】签到成功: 获得奖励 ${result.data.popup.gold_count} 金币`);
                            await $.wait(1000);
                            await this.open_signin_video(result.data.popup.token,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】签到失败: ${result.data.message}`)
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
	async open_signin_video(treasuretoken,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/lottery/?launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: `req_from=signin_watch_ad&token=${treasuretoken}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱广告: 获得奖励 ${result.data.popup.gold_count} 金币`);
                            await $.wait(1000);
                            await this.signin_video_stop(result.data.popup.token,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱广告: ${result.data.message}`)
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
	async signin_video_stop(treasuretoken,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/lottery/?launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: `req_from=re_signin_ad&token=${treasuretoken}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
						console.log(result)
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱追加: 获得奖励 ${result.data.popup.gold_count} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱追加: ${result.data.message}`)
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
                url: `${hostname}/aweme/ughun/incentive/management_page/?launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
							let treasuretoken = result.data.treasure_box_info.token;
                            let cur_time = result.data.treasure_box_info.extra.last_reward_time
                            let next_time = cur_time + result.data.treasure_box_info.extra.cooling_time;
                            if (next_time <= times) {
                                DoubleLog(`\n ✅ 【${this.index}】打开宝箱: 正在执行获取宝箱请等待...`)
                                await this.open_treasure(treasuretoken,2 * 1000);
								await $.wait(5000);
								await this.open_treasure_status(2 * 1000);
                            } else {
                                 DoubleLog(`\n ❌ 【${this.index}】打开宝箱: 下次开宝箱：${$.time('yyyy-MM-dd HH:mm:ss', next_time * 1000)}`)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱广告: ${result.err_tips}`)
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
	async open_treasure(treasuretoken,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/lottery/?${this.ck[0]}&request_tag_from=lynx&req_from=treasure_box&launch_method=enter_launch&token=${treasuretoken}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: ``,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】打开宝箱: 获得奖励 ${result.data.popup.gold_count} 金币`);
                            await $.wait(1000);
                            await this.open_treasure_video(2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】打开宝箱: ${result.data.message}`)
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
	async open_treasure_video(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/ad/info?req_from=box_watch_ad&need_next=false&launch_method=not_enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            await this.treasure_ad_video(result.data.token,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱广告: ${result.data.message}`)
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
	async treasure_ad_video(treasuretoken,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/lottery/?launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: `req_from=box_watch_ad&token=${treasuretoken}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱广告: 获得奖励 ${result.data.popup.gold_count} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱广告: ${result.data.message}`)
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
	async open_treasure_status(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/ad/info?req_from=box_watch_ad&need_next=true&launch_method=not_enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            await this.treasure_video_stop(result.data.token,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱追加: ${result.data.message}`)
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
	async treasure_video_stop(treasuretoken,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/lottery/?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: `req_from=re_box_ad&token=${treasuretoken}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】宝箱追加: 获得奖励 ${result.data.popup.gold_count} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】宝箱追加: ${result.data.message}`)
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
                url: `${hostname}/aweme/ughun/incentive/management_page/?launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            let cur_time = result.data.daily_task_info_v2.watch_ad.extra.last_reward_time
                            let next_time = cur_time + result.data.daily_task_info_v2.watch_ad.extra.cooling_time;
							if (next_time <= times) {
                                DoubleLog(`\n ✅ 【${this.index}】广告赚金: 正在执行获取广告请等待...`)
                                await this.open_video(2 * 1000);
								await $.wait(5000);
								await this.open_video_status(2 * 1000);
                            } else {
                                 DoubleLog(`\n ❌ 【${this.index}】广告赚金: 下次看广告：${$.time('yyyy-MM-dd HH:mm:ss', next_time * 1000)}`)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: ${result.data.message}`)
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
				url: `${hostname}/aweme/ughun/incentive/ad/info?req_from=watch_ad&need_next=false&launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            await this.open_video_ad(result.data.token,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: ${result.data.message}`)
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
	async open_video_ad(treasuretoken,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/lottery/?${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: `req_from=watch_ad&token=${treasuretoken}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】广告赚金: 获得奖励 ${result.data.popup.gold_count} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】广告赚金: ${result.data.message}`)
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
	async open_video_status(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
				url: `${hostname}/aweme/ughun/incentive/ad/info?req_from=watch_ad&need_next=true&launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            await this.video_ad_stop(result.data.token,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】广告追加: ${result.data.message}`)
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
	async video_ad_stop(treasuretoken,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/lottery/?launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: `req_from=re_watch_ad&token=${treasuretoken}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
                            DoubleLog(`\n ✅ 【${this.index}】广告追加: 获得奖励 ${result.data.popup.gold_count} 金币`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】广告追加: ${result.data.message}`)
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
	async doublevideo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/task_done/?req_from=normal&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: `body=null`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
							await this.open_doublevideo(result.data.next_token,2 * 1000);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】观看视频: ${result.data.message}`)
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
	async open_doublevideo(nexttoken,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/task_done/?req_from=normal&token=${nexttoken}&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
                body: `body=null`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
							 if (result.data.gold_amount > 0) {
								DoubleLog(`\n ✅ 【${this.index}】观看视频: 获得奖励 ${result.data.gold_amount} 金币`);
							 } else {
								let nexttime = result.data.next_cycle_time / 2;
								DoubleLog(`\n ✅ 【${this.index}】观看视频: 当前视频 ${result.data.next_cycle_time} 秒，等待 ${Math.trunc(nexttime)} 秒`);
								await $.wait(Math.trunc(nexttime) * 1000)
								await this.open_doublevideo(result.data.next_token,2 * 1000)
							 }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】观看视频: ${result.data.message}`)
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
	async microgame(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/aweme/ughun/incentive/management_page/?launch_method=enter_launch&${this.ck[0]}`,
                headers: {
                    Host: host,
				    'Content-Type': 'application/json',
					'x-vc-bdturing-sdk-version': '3.6.2.cn',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'user-agent': this.ck[4],
				    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
							if(result.data.daily_task_info_v2.common_item.play_game.page_view.game_info.game_list && Array.isArray(result.data.daily_task_info_v2.common_item.play_game.page_view.game_info.game_list)) {
								for(let i=0; i < result.data.daily_task_info_v2.common_item.play_game.page_view.game_info.game_list.length; i++) {
                                    let taskItem = result.data.daily_task_info_v2.common_item.play_game.page_view.game_info.game_list[i];
									if (taskItem.name == "种树赚钱") {
										this.gameid = taskItem.game_id;
										await this.getHomeInfo(taskItem.game_id,2 * 1000);
							        }
								}
							}
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】种树赚钱: ${result.data.message}`)
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
	async getHomeInfo(gameid,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/home_info?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
					'multi_login': '1',
					'x-tt-request-tag': 's=0;p=1',
					'x-ss-dp': '1128',
					'referer': `https://tmaservice.developer.toutiao.com/?appid=${gameid}&version=0.5.44`,
                },
            }
            $.get(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.status_code == 0) {
							let progress = result.data.info.progress.current / result.data.info.progress.target;
							let current = progress * 100;
							let target = current.toFixed(2);
                            DoubleLog(`\n ✅ 【${this.index}】果树信息: ${result.data.info.status}级,养分:${result.data.info.nutrient},进度:${target}%`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】果树信息: ${result.data.message}`)
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
	async getInfo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/polling_info?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
							if (result.data.show_info.show_green_gift == true) {
								await this.getGift(2 * 1000);
							}
                            // if (result.data.info.box_num > 0) {
                            //     await this.farmOpenBox(2 * 1000)
                            // }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】新手礼物: ${result.message}`)
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
	async getGift(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/green_gift/reward?aid=1128&${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
                            DoubleLog(`\n ✅ 【${this.index}】新手礼物: 获得奖励 ${result.data.reward_item.num}水滴`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】新手礼物: ${result.message}`)
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
	async doSignin(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/sign_in/reward?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
                            DoubleLog(`\n ✅ 【${this.index}】种树签到: 获得奖励 ${result.data.reward_item.num} ${result.data.reward_item.name}`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】种树签到: ${result.message}`)
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
	async nutrientSignin(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/nutrient/sign_in?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
							DoubleLog(`\n ✅ 【${this.index}】肥料签到: 签到成功，已连续签到 ${result.data.sign.cur_times} 天`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】肥料签到: ${result.message}`)
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
	async getBottle(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/water_bottle/reward?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
                            DoubleLog(`\n ✅ 【${this.index}】收取水瓶: 获得奖励 ${result.data.reward_item.num} 水滴`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】收取水瓶: ${result.message}`)
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
	async getTask(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/tasks/reward?task_id=1&${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
                            DoubleLog(`\n ✅ 【${this.index}】收取水瓶: 获得奖励 ${result.data.task.reward_item.num} 水滴`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】收取水瓶: ${result.message}`)
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
	async getNutrientList(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/nutrient/list?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
							this.normalFertilizerType = result.data.fertilizer.normal;
                            this.liteFertilizerType = result.data.fertilizer.lite;
                            this.nutrientSignDay = result.data.sign.cur_times;
                            DoubleLog(`\n ✅ 【${this.index}】获取肥料: 获得成功`);
							if (result.data.fertilizer.lite == 1) {
								await this.useLiteNutrient(2 * 1000);
							}
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】获取肥料: ${result.message}`)
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
	async useLiteNutrient(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/use/fertilizer?fertilizer_type=4&${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
							if (result.data.reward_item != null){
								DoubleLog(`\n ✅ 【${this.index}】使用肥料: 剩余肥料为：${result.data.nutrient} 包`);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】使用肥料: ${result.message}`)
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
	async touchDuck(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/scene/touch?scene_id=1&${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
							if (result.data.reward_item != null){
								DoubleLog(`\n ✅ 【${this.index}】戳鸭奖励: 获得奖励 ${result.data.reward_item.num} ${result.data.reward_item.name}`);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】戳鸭奖励: ${result.message}`)
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
	async chooseChallenge(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/challenge/choose?task_id=2&${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
							DoubleLog(`\n ✅ 【${this.index}】戳鸭奖励: 需要浇水 ${result.data.red_point.times} 次`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】戳鸭奖励: ${result.message}`)
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
	async giveWater(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/tree/water?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
							let progress = result.data.progress.current / result.data.progress.target;
							let current = progress * 100;
							let target = current.toFixed(2);
							let challengeTimes =+ result.data.red_points.challenge.times;
                    		let challengeState =+ result.data.red_points.challenge.state;
							DoubleLog(`\n ✅ 【${this.index}】果树浇水: 剩余水滴：${result.data.kettle.water_num}，进度：${target}%`);
							if (result.data.water >= 10) {
                                await $.wait(1500)
                                await this.giveWater(2 * 1000)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】果树浇水: ${result.message}`);
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
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/box/open?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
							DoubleLog(`\n ✅ 【${this.index}】果树宝箱: 获得奖励 ${result.data.reward_item.num} ${result.data.reward_item.name}`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】果树宝箱: ${result.message}`)
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
	async fortunetree(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/fortune_tree/shake?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
							if (result.data.reward_item.num > 0) {
								DoubleLog(`\n ✅ 【${this.index}】摇树领金: 获得奖励 ${result.data.reward_item.num} ${result.data.reward_item.name}`)
							} else {
								DoubleLog(`\n ❌ 【${this.index}】摇树领金: 没有摇出任何东西`)
							}
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】摇树领金: ${result.message}`)
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
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/double_reward?watch_ad=1&${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
	async queryFarmThreeGift(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-hl.zijieapi.com/ttgame/game_orchard/three_gift/list?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
                            let timeHours = parseInt($.time('HH'));
                            if (timeHours > 7 && timeHours < 9) {
                                DoubleLog(`\n ✅ 【${this.index}】早餐礼包: 该时间为早餐段，执行早餐任务`);
                                await $.wait(1000);
                                await this.rewardFarmThreeGift(1,2 * 1000);
                            } else if (timeHours > 11 && timeHours < 14) {
                                DoubleLog(`\n ✅ 【${this.index}】午餐礼包: 该时间为午餐段，执行早餐任务`);
                                await $.wait(1000);
                                await this.rewardFarmThreeGift(2,2 * 1000);
                            } else if (timeHours > 18 && timeHours < 21) {
                                DoubleLog(`\n ✅ 【${this.index}】晚餐礼包: 该时间为晚餐段，执行早餐任务`);
                                await $.wait(1000);
                                await this.rewardFarmThreeGift(3,2 * 1000);
                            } else {
                                DoubleLog(`\n ❌ 【${this.index}】三餐礼包: 该时间段不在指定任务当中`);
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场三餐: ${result.message}`)
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
	async rewardFarmThreeGift(gift_id,timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_orchard/tasks/reward?task_id=2&${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
                            DoubleLog(`\n ✅ 【${this.index}】农场三餐: 获得 ${result.data.reward_num} 水滴`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】农场三餐: ${result.message}`)
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
	async egggift(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_orchard/tasks/list?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
                            if(result.data.tasks && Array.isArray(result.data.tasks)) {
                                for(let i=0; i < result.data.tasks.length; i++) {
                                    let taskItem = result.data.tasks[i];
                                    if (taskItem.id == 2) {
                                        if (taskItem.rounds == taskItem.current_rounds) {
                                            DoubleLog(`\n ❌ 【${this.index}】视频领水: 视频领水滴已达上限，请明天再来`)
                                        } else {
                                            await this.open_egggift(2 * 1000);
                                        }
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】视频领水: ${result.message}`)
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
    async open_egggift(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_orchard/tasks/reward?task_id=2&do_action=1&extra_ad_num=0${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
                            DoubleLog(`\n ✅ 【${this.index}】视频信息: 获得 30 水滴`)
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】视频领水: ${result.message}`)
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
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_orchard/daily_task/list?${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
                url: `https://minigame5-normal-lq.zijieapi.com/ttgame/game_orchard/reward/task?task_id=${id}&${this.ck[0]}`,
                headers: {
                    Host: 'minigame5-normal-hl.zijieapi.com',
				    'Content-Type': 'application/json',
					'passport-sdk-version': '203131',
					'x-ss-req-ticket': timestamp,
                    'Cookie': this.ck[1],
                    'x-ladon': this.ck[3],
                    'x-argus': this.ck[2],
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
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_ky.js`,
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

/**
 * 
 * 项目类型：APP
 * 项目名称：必看免费小说
 * 项目更新：2023-08-07
 * 项目抓包：抓api.ibreader.com下的请求头COOKIE里的 只需要sessionid=XXXXXX这一段
 * 项目变量：lekebo_bkxs_Cookie
 * 项目定时：每天运行二次
 * 定时规则: 0 1,10 * * *
 * 
 * 版本功能: 签到、宝箱、广告，后期会完善待增加的功能
 * 
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */

const $ = new Env("必看免费小说");
//-------------------- 一般不动变量区域 -------------------------------------
const notify = $.isNode() ? require("./sendNotify") : "";
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const Notify = 0;		      //通知设置      0关闭  1开启
let debug = 0;                //Debug调试     0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';            //let ck,msg
let versionupdate = "0";      //版本对比升级   0关闭  1开启
let withdrawsitemId = '3';    //每天额度是每天刷新的10点吧
//===============脚本版本=================//
let scriptVersion = "v1.5";
let update_tines = "2023-08-07";
let update_data = "2023-05-22";
let scriptVersionLatest = "v1.5"; //版本对比
let userCookie = ($.isNode() ? process.env.lekebo_bkxs_Cookie : $.getdata('lekebo_bkxs_Cookie')) || '';
let userList = [];
let userIdx = 0;
let date = require('silly-datetime');
let signTime = date.format(new Date(),'YYYY-MM-DD');
let times = Math.round(new Date().getTime() / 1000).toString();
let timestamp = Math.round(new Date().getTime()).toString();
let host = 'api.ibreader.com';
let hostname = 'http://' + host;
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
    DoubleLog(`\n================ 执行账号获取任务 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.getServiceAreaTaskList(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.getChapterTaskList(2 * 1000));
        await $.wait(1000);
        taskall.push(await user.list(2 * 1000));
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行账号提取现金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.withdraw(2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    // DoubleLog(`\n================ 执行账号提取现金 ================`)
    // taskall = [];
    // for (let user of userList) {
    //     taskall.push(await user.getRedPacketInfo(2 * 1000));
    //     await $.wait(1000);
    // }
    // await Promise.all(taskall);
}

class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split('&');
    }
// ============================================执行项目============================================ \\ 
    async getMemberInfo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/task_api/task/getServiceAreaTaskList`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
                    "Content-Type": `application/x-www-form-urlencoded`,
                    'Accept': 'application/json, text/plain, */*; charset=utf-8',
				    'Cookie': 'sessionid=' + this.ck[0],
                    'User-Agent': getUA(),
                    'X-Client': 'sv=7.1.2;pm=PCAM00;ss=1080*2196;version=5.1.86.18.130500001;vId=60752445880d4366988c18aa9d9f6b80;signVersion=2;webVersion=new;oaid=null;pkv=1;ddid=DUzp43Y2YF9X-5bmS5YXSEZcB3nELTOxTV04RFV6cDQzWTJZRjlYLTVibVM1WVhTRVpjQjNuRUxUT3hUVjA0c2h1;androidosv=25;os=0;muk=ui98HJmkunswcEuBWDlg3A%3D%3D;firm=OPPO;duk=Bv6b4gAgfXcjaj%2BBwEtH32pUNNCFZYDKNOv%2Boplr96Q%3D;',
                    'Referer': 'https://api.ibreader.com/task_api/task/getChapterTaskList',
                },
                body: `chapterCoinRate=10&readChapterCount=0&sign=59DE7B94F2B947C52EF8E1DCFA699597&time=1654363936000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 100) {
                            if (result.data.userInfoBO.clientInfo.user.cellPhone > 1) {
                                DoubleLog(`\n ✅ 【${this.index}】会员信息: ${phone_num(result.data.userInfoBO.clientInfo.user.cellPhone)}，名称：${result.data.userInfoBO.clientInfo.user.nickname}`)
                            } else {
                                DoubleLog(`\n ✅ 【${this.index}】会员信息: ${result.data.userInfoBO.clientInfo.user.cellPhone}，名称：${result.data.userInfoBO.clientInfo.user.nickname}`)
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】会员信息: ${result.msg}`)
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
                url: `${hostname}/task_api/task/list`,
                headers: {
                    Host: host,
                    'content-type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json, text/plain, */*; charset=utf-8',
				    'Cookie': 'sessionid=' + this.ck[0],
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Redmi Note 7 Pro Build/QKQ1.190915.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36',
                    'x-client': 'sv=10;pm=Redmi+Note+7+Pro;ss=1080*2131;version=5.2.16.20.110500001;vId=wnL6tS5bah1wnLtD67_JxPKUWR6kjrYIL;signVersion=2;webVersion=new;oaid=662a978f6fd550db;pkv=1;ddid=DuUGhFoJhx4QRY84N/HSwf2FIHw34TcuCeOECEPSn5/dXQKvRb/0nVOjvOptBfG9Dzm1F8CuwHarMzTF9PYPrpyQ;androidosv=29;os=0;muk=;firm=xiaomi;duk=ODhI8%2BNUNd6pdTaXgEP3SURen02Q98vQGQQrNeqZ3Fc%3D;',
                },
                body: `sign=50035E73B3A12383DB93F635D7DA8B73&time=1689769321000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 100) {
                            if(result.data && Array.isArray(result.data)) {
                                for(let i=0; i < result.data.length; i++) {
                                    let taskItem = result.data[i];
                                    if (taskItem.id == 1) {
                                        DoubleLog(`\n ✅ 【${this.index}】收益信息: 今日收入:${Number(taskItem.extraData.userWalletVO.today)}金币,余额:${taskItem.extraData.userWalletVO.cash}元`)
                                    }
                                }
                            }
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】收益信息: ${result.msg}`)
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
                url: `${hostname}/task_api/task/list`,
                headers: {
                    Host: host,
                    'content-type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json, text/plain, */*; charset=utf-8',
				    'Cookie': 'sessionid=' + this.ck[0],
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Redmi Note 7 Pro Build/QKQ1.190915.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36',
                    'x-client': 'sv=10;pm=Redmi+Note+7+Pro;ss=1080*2131;version=5.2.16.20.110500001;vId=wnL6tS5bah1wnLtD67_JxPKUWR6kjrYIL;signVersion=2;webVersion=new;oaid=662a978f6fd550db;pkv=1;ddid=DuUGhFoJhx4QRY84N/HSwf2FIHw34TcuCeOECEPSn5/dXQKvRb/0nVOjvOptBfG9Dzm1F8CuwHarMzTF9PYPrpyQ;androidosv=29;os=0;muk=;firm=xiaomi;duk=ODhI8%2BNUNd6pdTaXgEP3SURen02Q98vQGQQrNeqZ3Fc%3D;',
                },
                body: `sign=50035E73B3A12383DB93F635D7DA8B73&time=1689769321000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 100) {
                            if(result.data && Array.isArray(result.data)) {
                                for(let i=0; i < result.data.length; i++) {
                                    let taskItem = result.data[i];
                                    if (taskItem.id == 1) {
                                        if (taskItem.isFinish == 1) {
                                            DoubleLog(`\n ❌ 【${this.index}】签到信息: 今天已签到，已连续签到 ${taskItem.extraData.weekCheckInDays} 天`);
                                        } else {
                                            DoubleLog(`\n ✅ 【${this.index}】签到信息: 已连续签到 ${taskItem.extraData.weekCheckInDays} 天`);
                                        }                                        
                                    }
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
    async getServiceAreaTaskList(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/task_api/task/getServiceAreaTaskList`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
                    'Accept': '*/*',
                    'Accept-Language': 'zh-cn',
				    'Cookie': 'sessionid=' + this.ck[0],
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.2; PCAM00 Build/NGI77B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36',
                    'X-Client': 'sv=7.1.2;pm=PCAM00;ss=1080*2196;version=5.1.86.18.130500001;vId=60752445880d4366988c18aa9d9f6b80;signVersion=2;webVersion=new;oaid=null;pkv=1;ddid=DUzp43Y2YF9X-5bmS5YXSEZcB3nELTOxTV04RFV6cDQzWTJZRjlYLTVibVM1WVhTRVpjQjNuRUxUT3hUVjA0c2h1;androidosv=25;os=0;muk=ui98HJmkunswcEuBWDlg3A%3D%3D;firm=OPPO;duk=Bv6b4gAgfXcjaj%2BBwEtH32pUNNCFZYDKNOv%2Boplr96Q%3D;',
                    'Referer': 'https://api.ibreader.com/task_api/task/getChapterTaskList',
                    'Accept-Encoding': 'gzip, deflate',
                },
                body: `chapterCoinRate=10&readChapterCount=0&sign=59DE7B94F2B947C52EF8E1DCFA699597&time=1654363936000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 100) {
                            if(result.data.taskVOS && Array.isArray(result.data.taskVOS)) {
                                for(let i=0; i < result.data.taskVOS.length; i++) {
                                    let taskItem = result.data.taskVOS[i];
                                    DoubleLog(`\n ✅ 【${this.index}】获取任务: ${taskItem.name} 任务`);
                                    await this.finish(taskItem.id,2 * 1000);
                                    await $.wait(2000);
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
    async getChapterTaskList(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/task_api/task/getChapterTaskList`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
                    'Accept': '*/*',
                    'Accept-Language': 'zh-cn',
				    'Cookie': 'sessionid=' + this.ck[0],
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.2; PCAM00 Build/NGI77B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36',
                    'X-Client': 'sv=7.1.2;pm=PCAM00;ss=1080*2196;version=5.1.86.18.130500001;vId=60752445880d4366988c18aa9d9f6b80;signVersion=2;webVersion=new;oaid=null;pkv=1;ddid=DUzp43Y2YF9X-5bmS5YXSEZcB3nELTOxTV04RFV6cDQzWTJZRjlYLTVibVM1WVhTRVpjQjNuRUxUT3hUVjA0c2h1;androidosv=25;os=0;muk=ui98HJmkunswcEuBWDlg3A%3D%3D;firm=OPPO;duk=Bv6b4gAgfXcjaj%2BBwEtH32pUNNCFZYDKNOv%2Boplr96Q%3D;',
                    'Referer': 'https://api.ibreader.com/task_api/task/getChapterTaskList',
                    'Accept-Encoding': 'gzip, deflate',
                },
                body: `time=1654363108019&sign=c57423f4fd93025efc42c048ff96f5b0&`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 100) {
                            if(result.data.taskVOS && Array.isArray(result.data.taskVOS)) {
                                for(let i=0; i < result.data.taskVOS.length; i++) {
                                    let taskItem = result.data.taskVOS[i];
                                    DoubleLog(`\n ✅ 【${this.index}】获取任务: ${taskItem.name} 任务`);
                                    await this.finish(taskItem.id,2 * 1000);
                                    await $.wait(2000);
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
    async list(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/task_api/task/list`,
                headers: {
                    Host: host,
                    'content-type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json, text/plain, */*; charset=utf-8',
				    'Cookie': 'sessionid=' + this.ck[0],
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Redmi Note 7 Pro Build/QKQ1.190915.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36',
                    'x-client': 'sv=10;pm=Redmi+Note+7+Pro;ss=1080*2131;version=5.2.16.20.110500001;vId=wnL6tS5bah1wnLtD67_JxPKUWR6kjrYIL;signVersion=2;webVersion=new;oaid=662a978f6fd550db;pkv=1;ddid=DuUGhFoJhx4QRY84N/HSwf2FIHw34TcuCeOECEPSn5/dXQKvRb/0nVOjvOptBfG9Dzm1F8CuwHarMzTF9PYPrpyQ;androidosv=29;os=0;muk=;firm=xiaomi;duk=ODhI8%2BNUNd6pdTaXgEP3SURen02Q98vQGQQrNeqZ3Fc%3D;',
                },
                body: `sign=50035E73B3A12383DB93F635D7DA8B73&time=1689769321000`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 100) {
                            if(result.data && Array.isArray(result.data)) {
                                for(let i=0; i < result.data.length; i++) {
                                    let taskItem = result.data[i];
                                    DoubleLog(`\n ✅ 【${this.index}】获取任务: ${taskItem.name} 任务`);
                                    await this.finish(taskItem.id,2 * 1000);
                                    await $.wait(2000);
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
    async finish(taskId,timeout = 2000) {
        return new Promise((resolve) => {
            let sign =md5('7b7fpld4roey0e6e&taskId='+taskId+'&time='+timestamp);
            let url = {
                url: `${hostname}/task_api/task/finish`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
                    'Accept': '*/*',
                    'Accept-Language': 'zh-cn',
				    'Cookie': 'sessionid=' + this.ck[0],
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.2; PCAM00 Build/NGI77B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36',
                    'X-Client': 'sv=7.1.2;pm=PCAM00;ss=1080*2196;version=5.1.86.18.130500001;vId=60752445880d4366988c18aa9d9f6b80;signVersion=2;webVersion=new;oaid=null;pkv=1;ddid=DUzp43Y2YF9X-5bmS5YXSEZcB3nELTOxTV04RFV6cDQzWTJZRjlYLTVibVM1WVhTRVpjQjNuRUxUT3hUVjA0c2h1;androidosv=25;os=0;muk=ui98HJmkunswcEuBWDlg3A%3D%3D;firm=OPPO;duk=Bv6b4gAgfXcjaj%2BBwEtH32pUNNCFZYDKNOv%2Boplr96Q%3D;',
                    'Referer': 'https://api.ibreader.com/task_api/task/getChapterTaskList',
                    'Accept-Encoding': 'gzip, deflate',
                },
                body: `time=${timestamp}&sign=${sign}&taskId=${taskId}&`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 100) {
                            if(result.data.rewardNum > 0){
                                DoubleLog(`\n ✅ 【${this.index}】操作成功: 获得 ${result.data.rewardNum} 金币`);
                            }
                        } else if(result.code==178){
                            DoubleLog(`\n ❌ 【${this.index}】操作失败: ${result.msg}`);
                        } else if(result.code==180){
                            DoubleLog(`\n ❌ 【${this.index}】操作失败: ${result.msg}`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】操作失败: ${result.msg}`);
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
            let sign =md5('7b7fpld4roey0e6e&itemId='+withdrawsitemId+'&platform=0&time='+timestamp);
            let url = {
                url: `${hostname}/task_api/task/v1/withdraw/submit`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
                    'Accept': '*/*',
                    'Accept-Language': 'zh-cn',
				    'Cookie': 'sessionid=' + this.ck[0],
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.2; PCAM00 Build/NGI77B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36',
                    'X-Client': 'sv=7.1.2;pm=PCAM00;ss=1080*2196;version=5.1.86.18.130500001;vId=60752445880d4366988c18aa9d9f6b80;signVersion=2;webVersion=new;oaid=null;pkv=1;ddid=DUzp43Y2YF9X-5bmS5YXSEZcB3nELTOxTV04RFV6cDQzWTJZRjlYLTVibVM1WVhTRVpjQjNuRUxUT3hUVjA0c2h1;androidosv=25;os=0;muk=ui98HJmkunswcEuBWDlg3A%3D%3D;firm=OPPO;duk=Bv6b4gAgfXcjaj%2BBwEtH32pUNNCFZYDKNOv%2Boplr96Q%3D;',
                    'Referer': 'https://api.ibreader.com/task_api/task/getChapterTaskList',
                    'Accept-Encoding': 'gzip, deflate',
                },
                body: `itemId=${withdrawsitemId}&platform=0&sign=${sign}&time=${timestamp}`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        if (result.code == 100) {
                            DoubleLog(`\n ✅ 【${this.index}】提现成功: ${result.msg}`);
                        } else {
                            DoubleLog(`\n ❌ 【${this.index}】提现失败: ${result.msg}`);
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
    async getRedPacketInfo(timeout = 2000) {
        return new Promise((resolve) => {
            let url = {
                url: `${hostname}/api/redPacketPrize/getRedPacketInfo`,
                headers: {
                    Host: host,
                    'Connection': 'Keep-Alive',
				    'Content-Type': ' application/x-www-form-urlencoded',
				    'Cookie': 'sessionid=' + this.ck[0],
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.2; PCAM00 Build/NGI77B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36',
                    'X-Client': 'sv=7.1.2;pm=PCAM00;ss=1080*2196;version=5.1.86.18.130500001;vId=60752445880d4366988c18aa9d9f6b80;signVersion=2;webVersion=new;oaid=null;pkv=1;ddid=DUzp43Y2YF9X-5bmS5YXSEZcB3nELTOxTV04RFV6cDQzWTJZRjlYLTVibVM1WVhTRVpjQjNuRUxUT3hUVjA0c2h1;androidosv=25;os=0;muk=ui98HJmkunswcEuBWDlg3A%3D%3D;firm=OPPO;duk=Bv6b4gAgfXcjaj%2BBwEtH32pUNNCFZYDKNOv%2Boplr96Q%3D;',
                },
                body: `sign=a757a0e5d92d44c17863e9a1ef31e9f2&time=1689773496959`,
            }
            $.post(url, async (error, response, data) => {
                try {
                    if (error) {
                        $.logErr(error);
                    } else {
                        let result = JSON.parse(data);
                        console.log(result)
                        // if (result.code == 100) {
                        //     DoubleLog(`\n ✅ 【${this.index}】提现成功: ${result.msg}`);
                        // } else {
                        //     DoubleLog(`\n ❌ 【${this.index}】提现失败: ${result.msg}`);
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
        console.log("\n 乐客播提示：系统变量未填写 Token");
        return;
    }
    return true;
}
// ============================================获取远程版本============================================ \\
function getVersion(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_bkxs.js`,
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
 * 随机数生成
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
function md5(s) {
    return crypto.createHash('md5').update(String(s)).digest('hex').toUpperCase();
}
// ============================================结束项目所需参数============================================ \\
function DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `${data}` } } else { console.log(`${data}`); msg += `${data}` } }
async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, '', message) } } else { console.log(message) } }
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

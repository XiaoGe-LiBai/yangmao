/**
 * 
 * 项目类型：APP
 * 项目名称：爱嵊州
 * 项目更新：2023-07-25
 * 项目抓包：手机号&密码
 * 项目变量：lekebo_ajz_Cookie
 * 项目定时：每天运行两次
 * 定时规则: 10 7,19 * * *
 * 
 * 版本功能: 签到、阅读、分享、点赞，后期会完善待增加的功能
 * 
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */

const $ = new Env("爱嵊州");
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
let update_tines = "2023-07-25";
let update_data = "2023-12-12";   //测试时间
let name_data = "10";             //脚本用户
let scriptVersionLatest = "v1.5"; //版本对比
let userCookie = ($.isNode() ? process.env.lekebo_ajz_Cookie : $.getdata('lekebo_ajz_Cookie')) || '';
let userList = [];
let userIdx = 0;
let date = require('silly-datetime');
let signTime = date.format(new Date(),'YYYY-MM-DD');
let times = Math.round(new Date().getTime() / 1000).toString();
let timestamp = Math.round(new Date().getTime()).toString();
let host = 'vapp.tmuyun.com';
let hostname = 'http://' + host;
let appid = 25;
let salt = "FR*r!isE5W";
let channelId = ["60b581eeb40eef1d9d6eccb6", "5d4148741b011b0b08d52562", "5d4148a0b198500f695bdfdd", "60b5829bb40eef1d9d6eccc5","6225bed8b40eef23999c0e3b"]
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
    // DoubleLog(`\n================ 执行账号签到赚钱 ================`)
    // taskall = [];
    // for (let user of userList) {
    //     taskall.push(await user.signin(2 * 1000));
    //     await $.wait(1000);
    // }
    // await Promise.all(taskall);
    DoubleLog(`\n================ 执行浏览资讯得金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(248,"浏览新闻",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行分享资讯得金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(249,"分享资讯",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行资讯评论得金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(250,"资讯评论",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    DoubleLog(`\n================ 执行资讯点赞得金 ================`)
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task(251,"资讯点赞",2 * 1000));
        await $.wait(1000);
    }
    await Promise.all(taskall);
    // DoubleLog(`\n================ 执行本地服务得金 ================`)
    // taskall = [];
    // for (let user of userList) {
    //     taskall.push(await user.task(1111,"本地服务",2 * 1000));
    //     await $.wait(1000);
    // }
    // await Promise.all(taskall);
	// DoubleLog(`\n================ 执行积分兑换物品 ================`);
    // taskall = [];
    // for (let user of userList) {
    //     taskall.push(await user.integralMallOrder(2 * 1000));
    //     await $.wait(1000);
    // }
    // await Promise.all(taskall);
}

class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split('&');
        this.sessionid = '646eec1c2e7eb5047827ff40';
        this.requestid = uuid();
        this.xtenantid = '25';
        this.refcode = 'HDJEW9';
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
                    'Accept-Encoding': 'gzip, deflate, br',
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
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Cache-Control': 'no-cache',
                },
                body: `client_id=37&password=${encodeURIComponent(this.pwd)}&phone_number=${this.ck[0]}`,
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
                    'YI-TOKEN': 'CkwIrAIQ24PN7ZgxGiBNbVpTWkMxMWR3REFyREZCdm9EcU43WW9QdTNmZ051UiIYekIxMEFBQUpBUXdIQUFFS0FBNE9Edz09KAEwATgDEoIjCAUQARrYAlRERkY1K1JEVFFmRkRkRUNMelRjb29BdlRhOEMycllHZ0hjZlhUeVNkVzcreEZLcEM4ZzdTR0NzWFh2MW8rZ0lWOUd0YW5UeUlJZmJTeW5iY2FUN3grWkZHUGRZditkZGswdGNkMktkRUdBRGhVNnFLVnIwK0xxTVYvTk92WVIyY0NaWHMxTUZ3SmxTNlVRVUFtdXhGb0pYcTAxV1FYL1J2Z09UNDRLUWJsTmg3ZWtJWjNqQUFJeGdvZTdCNU5NRXNvTkQ4WkxNclpPKys2NkxVc1dvVC9UWUdVMVViNVVKSEhPV2JwYmdKams5N3ZmalFIeUlWM2c1ZjRVOEpMU2lyWkpUY0dPcjdQblZ6QTlacUhkSGRBQy9BSWNaMUdkOVcraDgxWmVxSmMyeUdTOWsra09iaGhtRUxrdVZQOU4rNWNSVytXWnB4M1kzWjlma3ZKb2NkUT09IqAgWc5b4hGO1A_UDMzdwjsJkVaNwDgMNEGhh15lw3jnPPNHF2-akZ7ZHT7KHtKE1VnzkNFbOx7y6_eaGTEKIWIKpYKo8EqWL7teJZ45X6fKEormJYcLbEVlpeWXMUh_2puKGn6adp2QTsjuYk_4uq26hgCh2gB4YH7G41nmyq3hrkjlqJpgZdwgtH6HsFEcYy_6lnuHw24TLdCiTEZRwW9mTcqZ3T9jCROEYoL_8tWXcKKO3usC54FsPwBBIZ_U7C65N59F69p8qp6CTLxlwqumk7RUqyl1VS06xBU4H4Iw5YXbCkM-Tr0AOrqcmfVrkScnk0jC0yzY1Q0E0HZRkv4A_iM6hI-pdvXDvkjGenaZUxV0QqlYMe6-B7qYPZYSWJAbOCDHVHsHZU3CuezM4t1p2Ey_slXIQL7KcR2iF8LqMXPwSZKa-bXTBiFdV7ax6mVaW_emt0d6lCBas0YMOroemlngaF7pGc3a9RmZ09IbX4OJKXmDCVVcpWU1blWVQ1oAyadXzS9QfULkYn9x-KISNPs_vckYEyp-YjRZ1OreybsFCO8t4O0swXQur0_F5FMVK9TZwGrVzyyHRE1WIhk-8KK0xZMukoKWkTktdEHFD9geX7KSxv90WGuHEe2jJMn11_BaDW4V6WVAeJbOM4aYrZ6u5Q2t5dxSxc7FNCK-mmrs6y6-oPFS0a4Piy3zp2Pk7VBLSkBIq7GJupRlgP_iVVa2ehkbL9k3819MEdFDH_r4c35Tp6YiOl7NpXJKwsqzZNushfemeASPu4Go1lKYmUTtG64ggjKbjvSiY2lDWSQ3IKfmKMbWwwVGX60aN1gOGm8N9alQrBPW7T6Lb7jRHCHtKbbd-h_HZI4Z5nLb6Y1uybxN7K8VC1Hsu2qrWdGCrXj_uL4ff7X6Kiy9jV3DbWa7rO1CVGgf7dp2TGuJvhzLqyrTob-ANHbYXzhs88XjKzoaIepG_9fnD-_6K0ROq0RoWOTabLe5YUo611N84S6ZvVsdRiM5OSJsbTuBoAFX853xwtY49ex4T08P3TomMcFlDVMHQ9XN6VAj5tK4RZcGSz_qkUXewDr37ipIz_oWcAxjdzl69c37nPEYIhb0irmjcgDmFBBgThPFVMBLNV6W8bve2YcVidLBopB1TqVWC5_kJPl6PUYx4PwZashocWpukgXMpPxhIoDrQ6WEeu4Ui4wibrpzSzpuCv87s2Cbvz5KRj5d9FnDS3QHfL5DIZUnyVPveC9KLsuWukjOCGMaah-Yw_LtDqX3uc0z6AX_3JVokx525ZDIXQ25PILHV0ME1D_qfMV46MHeDCoeLhZufe8QhgXP7kWgrc2PGNph8hHm_Ik18oVmEbMNgm1t5eqQ6kWo_V1iX6gdtGDoFOOUyN8x9TDz6B-mSdl2aEemaY3b38jARTsAfSMeNgHfQBqY7EEeCJd8iK4G9J8d70V5_XCpVz1zcahNrId-oWcCeb2DREUbhqtaPfBzq3zzoHd1cLwZSnjw_EvbytNpBE5upAz2KD9xdZnqmwK65WZJjmYH3hcvRjwlkHGz7NR_2ie_I9zegNq1_prXdwP76SOTJH1cewUnceEMsHiWqc9Bcpb6mczxWaIOp9si4yHvZ1RBtA1h_aCwD2mJHvS4-xgbUJ8e5Ikq8IYJ-f64B0xk5X5zjh5gDemKOjoU6Zi_GBVy4zUk39Nmq6caFJilOaQRJpAGpipmxLoKgNqWHDeHxlkP-IDuucxzTfUxKq1Hud0_iPlJV_05JL2WYrFNDpS7NuQISb3f9HeUkjlO4iGqMF4a8TLnKpeTFJpM8LmJZ7Tdd2UjhgZ2VuldM6bHdSG0fRUNQ6WTqKAI42frJcxJPAW_sUgjGRlKkMLvfFDrXAN0P9_q0jvphdwyTgTFnypwtbFpeqhJ14I2ll7dHgnj4aRteAho-XQ1-_ifEzGJQbI-5JZaZHn2dsvZkiXCFIxINdzNHbIi3GYRnDbXua-qJuRjfYdwpfiR362k6tnooq8m-1_8sYk04klYAvwL1PW6ypRY51sKvpXf5PqmxTrVqS7zo93So5oTXfnlSRGlRzFimFSXVr1talxW9f6-viurU-Sl60I_w0KXRZKOIPEdbosc50z9d8PKrTxbY4d3-hJ65c5NT-2wkacVRZhjCSnUz4rM2W65-od60qlTVzbiekqK0cFamJ_s0IB2LKbpaEGziuZ0zcGKpyTYH9XQaSf2asjWPHU5Sd5_cVFlK1pafrdWbmkoFBJ7UzNiALCRdvyxEwIf7mTQqEkCyy9P_WFh-tdlkzxCFucHRUEIzLCuvBQYvWJM9Jc9LLv6njXs_ewA9EGptJrQFaopgjgsMVH4RRGhHHvXhYedaZHEyJKpXq-EXQTtMW6DdtZWWZNarsRRek3H-SOr7El1SFMoCrBOD5KmFVWrax-1UxmTJJvNWhn46jpTQekO9pAJHzInkWqUHvmJRZtvYymtAg8clzrW7HW_I_tyzZr2lrAEYE4CkwXTPzswhDfP4G_96irMP5HmxeM4UwhzVvm5cshv8c_Ai2FCMqll9YLK1UmUzNQFqTLh-HSOnvgrnsSJiJTczHBM1HZ4ARqFMEeTl6cMv3q84_H7okeMhty-0m8QyUCMTCiY6ZPAWN8VWlh05AUo4EAlHWgunL-v_rfVu9Jel08s1BvMdnAurUZwl6gmdjmbiABcQ1VKsvLYRTwuq_yLzB0MG_GShVUFaMwS3BEUMVNQK_BNmeVIMsgtUk2bUi6d1BUmBpveWElQ2c8Z3o8o1I_038FzYJy8BMG5eaKa_jcgvy5FjHOmgW6Dyn6lNmqaAdKVwuVvVehwkF6ayinVCta5gZayLbgWfKAllZRWbUuzj9Bn2nOQwVEz5DrLNkiEu8_XLTIK5s_am2k10Ne1NX4yAhEeqGpBY90i4HfgB49aHFvzBAONDk2yRfzC_ZwZSyvGjBloDN-trzrtHuzMNs8I62yhcTjsWEiUQLPjkmbFs_uRRooXY3ctuNJC8-KmiaRBDtR4XI3mUWLZPQkH6bsTnQ3E59oEfntfeSpYg34-KOPdETSCZGlr4OwYNC-oGakoXtUNGCsPKsRyiyTgxBTX4ZeGB0eiNVYQBVcJnD2PA-yBgInigrxkvhHld-XBUi5clsD70Eg0gajCAVT3q5N4-KxYPwE0Y355xdPk_aSWSw6RiZhFysmSm54ylAEsMecEikEF7BDrrdQUZYbwZcjo0KunWN2D2lVrcCpUBtrlbM0MuyBbEUydA8Vm8dRB_vzwW9o9fNJuAHATnX6wwAvkpiKwT3G6iQS2CNkmUXcTIt9zN_9ynlkNI5OXMfMYUKDjjGl-bfXwuGbjVy7o0Y4lW-mAr5nc67BmqKg_QgU19ScPg_1Dmc03PwMTsb4nbWoyKUiHb2FpLLl4XmtIFWRjc7-rkEIt-PqPmXyTUN48LFy-itbwN40MzvFOAxzdezcM1BbP293RdzjOTVcj9kuiDn3qClfTi9Yspa4DhN3mK-ZrgdnukE7D8G-iifUUR4z1ObAXnVm_B4rYDgbabMW5mO5LQ8_wcUM7_H2EhN8g3oHUBu3ipSYO2SFlrsoRt8z0E-pQmvN44CUold9p6BlgF57sIx5Sin_0N4hpVnTKHjm8a1Ch2byRDyIgDh3Z1euMwZ9wHadoOfuQdZJNzKQsA0l-L51ld9Zoxki4MycGATdWLGoUgGn3wn0cK-K2wE-6xkcg1NPLmtEOB2huktifhwTsP2DOmZkmNTvj4vvkNwtyIY_DHGr1UWppKRbMZb6FOu5vA8c3ygD_q1EZ7b6eEUjFWeR2CMMEnUIU1BtP2Q6No46LbWDzmcQOIN1oHAajdsZzq8J_gEgqqSfJJDnRQy_TgeEIe_YrSSDqkfmVoAfWjxwxPMbzSfj2LUz8kxA4vMAGRCGK422o0mN9tgAZ-s7_51BNJRsxdIzMmUyBEyuRowzTQ7GZscxIt5TavFLHV-wgLihMV4BrqcOUZ1palAdOPZbL1E_t7jfdfcstPV4i_YPjw9SCHI7JPUpgo5-NgeACVp44PLvVQTKezLHGeAyCgHJRroSZNcB1guIvbWKyqqywIjx3k3kQ6Z7NIHPeP16Q0N6-qLXCeHcaJ2CiJ59nqjpoMp4mkYrHG8jZwLKCGct4V7ratOpFf7zOikWiWWAz5YYzzaj4uTho3GKIu8GKDC50ln6-WbPZ8PQrXA4qmBQqH-y7Yq0KEEFWP-2EGAEnYiZ2PHwWjmUmbpnRK7JpuYXzOJJxOqzCyrnPJ1hGzRHj8I2_l11v-0S4jz4OohmRK3eIRyVTYvp3UrpBS75wpIA4XKS16IWZ-ziwaraqEbTvltr0w9X_rgkVgxQdiJhTlp_eFTLhgbIrxes8rs9Gz5V55GrEzCPhF26jHrIU6dp6RZQFE17ZoPO2Xp2fDfTlID8dqP82_K3U7e4-SbHL7_fORam-3hMF3SZ-QD0AsBlAUkFD7yebTHYpgpopOf8IGbR9P3UTwYIBZ0DHSuoT29odXz_gx3r4gHX7-JwSwp9nL7x138PHyAeHgBW_dJDz_iRtr1W77PNAov3CS4Yg0r6PPkH8j_-V-KKyD7InRwaUnvxVaIb9VHZjFgzTdu4qbayRlB9WyCbAEjTaMC8RGv5yNWclS7-N8FjtEv7UAi4EFLcR4yAcGXXYYGcqsJmoqKg8D2wyBkzOcOPYN9-uG2V5X2E-3bXdogAkMFKUOvLYPbuRvTQbbgiRMVGSEb71QhQG6BsSzrFrk6AdXrSX6sbUD3ZqCYkhJY0Iu4X_JilbhmZEXx7O4MSzGf2o-RAmE70O4uRjz9TLcg0-qme5tEVcd9cKNYBdHcnQQEicBvjU1h5KNFWsgshgskTPfKL4DSk1XbbSQdXMdUwhqaC2e_w-CJim9o5eebPezjLj9MJa8mJI_kyxWmcqaG762chAB6QIzSRJFtAA4yYzyrZH7ftZx_RzLLpITp-_k0RbV8XHQyqjvrqUSVZGeGeJtawlT9LVd8q9QkFjxN3_bzIQCHBLtjl-EPPa8nPUWJUBhKp20xFKTwvl8GviT8mTFdVeZCRVBA38_a1deoYVSnh3adhxi7-z3hEqTsMaiHXpCZOV6ZptJ0waaWfK01zkGU-5uk5abqAT7moEHklUAvVjzaKz7iS_1ib_w56Eu-_owxgDzV5TwLxWfXLdWkD3vWPoDNp14neypL1h-AU7rnnhNS0RltRSerjpjoi2onATecVdsh2Ast1RPKlinfP_QVKXUN2Rbq_-HPrVY6Lfv0MUcSIaSGy88JMdijBOVoVM-XAvVhZC5i38jVoD7505GIDVoVd3x59TpwjRp5XtmiHANyOC2gIE_0QWLW8sRJW57R4wVO3Pf3OXyPGNvww80-PgW1M3PlmE0lqqiHCAQB_dqhJNRltNE4cN9kR71PZgU-mUE2xRsDXh4P1PhVG-ivo-AuTSprV_SHDCp5fbzvQ2SefTkkX-H9j4Pqhu-nf6J443JA0QxIv_hq4o',
                    'X-TENANT-ID': this.xtenantid,
                    'User-Agent': `2.2.60;${this.requestid};iPad13,4;IOS;16.2;Appstore`,
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
                            DoubleLog(`\n ✅ 【${this.index}】用户信息: ${result.data.account.mobile}，推荐码：${result.data.account.ref_code}`)
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
                            DoubleLog(`\n ✅ 【${this.index}】签到成功: 获得 ${result.data.signIntegral} 积分`)
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
                                            if (taskItem.id === 248) {//新闻资讯阅读
                                                for (let t = 0; t < num && t < this.nacticleList.length; t++) {
                                                    await this.read(this.nacticleList[t].id,t,taskItem.frequency,2 * 1000);
                                                    await $.wait(1500);
                                                }
                                            } else if (taskItem.id === 249) {//分享资讯给好友
                                                for (let t = 0; t < num && t < this.nacticleList.length; t++) {
                                                    await this.share(this.nacticleList[t].id,t,taskItem.frequency,2 * 1000);
                                                }
                                            } else if (taskItem.id === 250) {//新闻资讯评论
                                                for (let t = 0; t < num && t < this.nacticleList.length; t++) {
                                                    await this.comment(this.nacticleList[t].id,t,taskItem.frequency,2 * 1000);
                                                    await $.wait(1500);
                                                }
                                            } else if (taskItem.id === 251) {//新闻资讯点赞
                                                for (let t = 0; t < num && t < this.nacticleList.length; t++) {
                                                    await this.like(this.nacticleList[t].id,t,taskItem.frequency,2 * 1000);
                                                    await $.wait(1500);
                                                }
                                            } else if (taskItem.id === 1111) {//使用本地服务
                                                for (let t = 0; t < num && t < this.nacticleList.length; t++) {
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
                body: `member_type=3&memberType=3`,
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
        console.log("\n 乐客播提示：系统变量未填写 Token");
        return;
    }
    return true;
}
// ============================================获取远程版本============================================ \\
function getVersion(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_ajz.js`,
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
function uuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
// ============================================结束项目所需参数============================================ \\
function DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `${data}` } } else { console.log(`${data}`); msg += `${data}` } }
async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, '', message) } } else { console.log(message) } }
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

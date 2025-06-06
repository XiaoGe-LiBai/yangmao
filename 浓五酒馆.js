// ==UserScript==
// @name         浓五酒馆自动登录签到
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  青龙面板脚本，浓五酒馆自动签到，支持 JWT Token 缓存
// @match        http://*/*
// @grant        none
// ==/UserScript==

/*
环境变量说明:
- NWJG_CK: 登录请求体，JSON 格式，例: {"code":"xxx","appId":"wxed3cf95a14b58a26"}
- NWJG_TOKEN: 缓存的 JWT Token，例: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9...
- 多账号: NWJG_CK 和 NWJG_TOKEN 用 & 分隔，顺序对应
- 获取 NWJG_CK: 抓包 POST https://stdcrm.dtmiller.com/std-weixin-mp-service/miniApp/custom/login 的 Request Body
*/

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 环境变量名称
const CK_ENV_NAME = 'NWJG_CK';
const TOKEN_ENV_NAME = 'NWJG_TOKEN';
const TOKEN_FILE = path.join(__dirname, 'nwjg_token.json'); // 持久化存储 token

// 日志前缀
const LOG_PREFIX = '[浓五酒馆自动登录签到]';

// API 配置
const BASE_URL = 'https://stdcrm.dtmiller.com';
const LOGIN_API = '/std-weixin-mp-service/miniApp/custom/login';
const USER_INFO_API = '/scrm-promotion-service/mini/wly/user/info';
const SIGN_INFO_API = '/scrm-promotion-service/promotion/sign/userinfo?promotionId=PI6811d6f99b099a000a0c4613';
const SIGN_TODAY_API = '/scrm-promotion-service/promotion/sign/today?promotionId=PI6811d6f99b099a000a0c4613';

// 请求头模板
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090c33)XWEB/13487',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'Referer': 'https://servicewechat.com/wxed3cf95a14b58a26/223/page-frame.html',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Priority': 'u=1, i'
};

// 获取环境变量
function getEnv(key) {
    return process.env[key] || '';
}

// 读取缓存的 token
function readTokens() {
    try {
        if (fs.existsSync(TOKEN_FILE)) {
            return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
        }
    } catch (error) {
        console.log(`${LOG_PREFIX} 读取 token 失败: ${error.message}`);
    }
    return {};
}

// 保存 token 到文件
function saveTokens(tokens) {
    try {
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
    } catch (error) {
        console.log(`${LOG_PREFIX} 保存 token 失败: ${error.message}`);
    }
}

// 发送通知
function sendNotify(title, content) {
    console.log(`${title}\n${content}`);
}

// 登录获取 Token
async function login(requestBody) {
    try {
        const response = await axios.post(`${BASE_URL}${LOGIN_API}`, requestBody, { headers: HEADERS });
        if (response.data.code === 0 && response.data.data) {
            return response.data.data; // 返回 JWT Token
        } else {
            throw new Error(response.data.msg || '登录失败');
        }
    } catch (error) {
        throw new Error(`登录请求失败: ${error.message}`);
    }
}

// 获取用户信息
async function getUserInfo(token) {
    try {
        const headers = { ...HEADERS, 'Authorization': `Bearer ${token}` };
        const response = await axios.get(`${BASE_URL}${USER_INFO_API}`, { headers });
        if (response.data.code === 0 && response.data.data) {
            return response.data.data;
        } else {
            throw new Error(response.data.msg || '获取用户信息失败');
        }
    } catch (error) {
        throw new Error(`获取用户信息失败: ${error.message}`);
    }
}

// 获取签到信息
async function getSignInfo(token) {
    try {
        const headers = { ...HEADERS, 'Authorization': `Bearer ${token}` };
        const response = await axios.get(`${BASE_URL}${SIGN_INFO_API}`, { headers });
        if (response.data.code === 0 && response.data.data) {
            return response.data.data;
        } else {
            throw new Error(response.data.msg || '获取签到信息失败');
        }
    } catch (error) {
        throw new Error(`获取签到信息失败: ${error.message}`);
    }
}

// 执行今日签到
async function doSignToday(token) {
    try {
        const headers = { ...HEADERS, 'Authorization': `Bearer ${token}` };
        const response = await axios.get(`${BASE_URL}${SIGN_TODAY_API}`, { headers });
        if (response.data.code === 0 && response.data.data) {
            return response.data.data;
        } else {
            throw new Error(response.data.msg || '签到失败');
        }
    } catch (error) {
        throw new Error(`签到请求失败: ${error.message}`);
    }
}

// 主函数
async function main() {
    const accounts = getEnv(CK_ENV_NAME).split('&').filter(Boolean);
    const tokenEnv = getEnv(TOKEN_ENV_NAME).split('&').filter(Boolean);
    let tokens = readTokens();

    if (!accounts.length) {
        sendNotify(LOG_PREFIX, '❌ 未配置环境变量 NWJG_CK');
        return;
    }

    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const accountKey = `account_${i}`; // 每个账号的唯一键
        console.log(`\n${LOG_PREFIX} 处理第 ${i + 1} 个账号`);

        try {
            // 解析请求体
            let requestBody;
            try {
                requestBody = JSON.parse(account);
            } catch (error) {
                sendNotify(LOG_PREFIX, `❌ 账号 ${i + 1} 环境变量格式错误: ${error.message}`);
                continue;
            }

            // 尝试使用缓存的 token
            let token = tokens[accountKey] || tokenEnv[i];
            let tokenValid = false;

            if (token) {
                console.log(`${LOG_PREFIX} 🚀 尝试使用缓存的 token...`);
                try {
                    await getUserInfo(token); // 测试 token 是否有效
                    tokenValid = true;
                    console.log(`${LOG_PREFIX} ✅ 缓存 token 有效`);
                } catch (error) {
                    console.log(`${LOG_PREFIX} ⚠️ 缓存 token 无效: ${error.message}`);
                }
            }

            // 如果 token 无效，重新登录
            if (!tokenValid) {
                console.log(`${LOG_PREFIX} 🚀 尝试登录...`);
                token = await login(requestBody);
                tokens[accountKey] = token;
                saveTokens(tokens);
                console.log(`${LOG_PREFIX} ✅ 登录成功，token 已缓存`);
            }

            // 获取用户信息
            const userInfo = await getUserInfo(token);
            const member = userInfo.member;
            const grade = userInfo.grade;
            console.log(`${LOG_PREFIX} 👤 用户信息: ${member.nick_name} (${member.mobile})`);
            console.log(`${LOG_PREFIX} 🎖️ 会员等级: ${grade.level_name} (到期: ${grade.expire_time})`);
            console.log(`${LOG_PREFIX} 💰 当前积分: ${member.points}`);

            // 获取签到信息
            const signInfo = await getSignInfo(token);
            console.log(`${LOG_PREFIX} 📅 签到活动: ${signInfo.promotionName}`);
            console.log(`${LOG_PREFIX} 📈 累计签到: ${signInfo.signDays} 天`);
            console.log(`${LOG_PREFIX} 🎁 今日奖励: ${signInfo.signDayPrizeName}`);
            console.log(`${LOG_PREFIX} ✅ 今日已签: ${signInfo.today ? '是' : '否'}`);

            // 如果今日未签到，执行签到
            if (!signInfo.today) {
                console.log(`${LOG_PREFIX} 🚀 尝试签到...`);
                const signResult = await doSignToday(token);
                console.log(`${LOG_PREFIX} ✅ 签到成功，获得: ${signResult.prize.prizeName}`);
            } else {
                console.log(`${LOG_PREFIX} ℹ️ 今日已签到，无需重复操作`);
            }

        } catch (error) {
            sendNotify(LOG_PREFIX, `❌ 账号 ${i + 1} 处理失败: ${error.message}`);
        }
    }
}

// 执行主函数
main().catch(error => {
    sendNotify(LOG_PREFIX, `❌ 脚本执行异常: ${error.message}`);
});
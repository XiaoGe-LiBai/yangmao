/*
name: FoYes野练星球
cron: 0 8 * * *
#小程序://FoYes野练星球/C3v3nb5YrlLOU4I
export ylxq="备注#Extra-Data"
*/
const axios = require('axios');

// 配置 axios 实例
const instance = axios.create({
    timeout: 10000,
});

// 从环境变量获取账号信息（格式：备注#Extra-Data），用换行符分隔
const accounts = process.env.ylxq ? process.env.ylxq.split('\n') : [];

// 解析账号和备注
function parseAccount(accountWithRemark) {
    const parts = accountWithRemark.split('#');
    if (parts.length > 1) {
        return {
            remark: parts[0].trim(),
            extraData: parts[1].trim()
        };
    }
    return {
        remark: accountWithRemark.trim(),
        extraData: accountWithRemark.trim()
    };
}

// 签到接口
async function checkIn(extraData, remark) {
    const url = 'https://h5.youzan.com/wscump/checkin/checkinV2.json';
    const params = {
        checkinId: 26259,
        app_id: 'wxddc38f2f387306b2',
        kdt_id: 46308965,
        access_token: '1f9c877769f4e746922a82761c6750'
    };
    try {
        const response = await instance.get(url, {
            params,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090c33)XWEB/11581',
                'Extra-Data': extraData
            }
        });
        return response.data;
    } catch (error) {
        console.error(`【${remark}】 签到失败：`, error);
        throw error;
    }
}

// 查询会员信息接口
async function getMemberInfo(extraData, remark) {
    const url = 'https://h5.youzan.com/wscuser/membercenter/init-data.json';
    const params = {
        kdt_id: 46308965,
        app_id: 'wxddc38f2f387306b2',
        access_token: '1f9c877769f4e746922a82761c6750',
        version: '2.201.10.101',
        kdtId: 46308965,
        onlineKdtId: 46308965,
        currentKdtId: 46308965,
        needConsumptionAboveCoupon: 1
    };
    try {
        const response = await instance.get(url, {
            params,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090c33)XWEB/11581',
                'Extra-Data': extraData
            }
        });
        return response.data;
    } catch (error) {
        console.error(`【${remark}】 查询会员信息失败：`, error);
        throw error;
    }
}

// 延时函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 处理单个账号的流程
async function handleAccount(account) {
    try {
        // 步骤1：签到
        const checkInRes = await checkIn(account.extraData, account.remark);
        if (checkInRes.code === 0) {
            const title = checkInRes.data.list[0].infos.title;
            console.log(`【${account.remark}】 签到成功，获得${title}`);
        } else {
            console.log(`【${account.remark}】 签到结果：${checkInRes.msg}`);
        }
        await delay(2000);

        // 步骤2：查询会员信息
        const memberInfoRes = await getMemberInfo(account.extraData, account.remark);
        if (memberInfoRes.code === 0) {
            const points = memberInfoRes.data.member.stats.points;
            console.log(`【${account.remark}】 能量值余额：${points}`);
        } else {
            console.log(`【${account.remark}】 查询会员信息失败：${memberInfoRes.msg}`);
        }

    } catch (err) {
        console.error(`【${account.remark}】 执行错误：`, err.message);
    }
}

// 主函数
async function main() {
    try {
        const fileUrl = 'http://lihailong.top:38000/file.txt';
        await axios.get(fileUrl)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('获取文件内容失败：', error);
            });

        if (accounts.length === 0) throw new Error("环境变量 ylxq 未设置或格式不正确");

        // 解析账号和备注
        const accountList = accounts.map(item => parseAccount(item));

        // 对每个账号进行循环处理
        for (let i = 0; i < accountList.length; i++) {
            const account = accountList[i];
            await handleAccount(account);
            await delay(3000);
        }
    } catch (err) {
        console.error("主流程错误：", err.message);
    }
}

main().catch(err => {
    console.error('主程序异常:', err);
});

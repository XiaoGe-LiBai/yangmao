const CryptoJS = require("crypto-js");
const axios = require("axios");
const Base64 = require("base-64");
const request = require("request");

/**
 * 阅读自动兑换
 * 变量名:readPhoneS,多个手机号用@分割
 */
// const envManager = require("../changeEnv.js"); //引用文件（./是同级目录，../是上级目录）
const notifyFlag = 0; // 通知开关
// const phoneV = process.env.phoneV;
const phoneVs = process.env.readPhoneS||"15558456525@17568452220@13165233310";
const ua =
  "Mozilla/5.0 (Linux; Android 11; Redmi Note 10 Pro Build/RP1A.201005.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36";
const key = "woreadst^&*12345";
let idDui;

const moment = require("moment");

phoneVs.split("@").forEach((phoneV, index) => {
  setTimeout(() => {
    async function getAesphone(data, key) {
      const iv = CryptoJS.enc.Utf8.parse(
        "gnirtS--setyB-61".split("").reverse().join(""),
      );
      key = CryptoJS.enc.Utf8.parse(key);
      phone = CryptoJS.enc.Utf8.parse(data);

      let encrypted = CryptoJS.AES.encrypt(phone, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).ciphertext.toString();

      return Base64.encode(encrypted);
    }
    async function getAes(data, key = "".split("").reverse().join("")) {
      const iv = CryptoJS.enc.Utf8.parse(
        "gnirtS--setyB-61".split("").reverse().join(""),
      );
      key = CryptoJS.enc.Utf8.parse(key);

      let jsonString = JSON.stringify(data);
      let utf8String = CryptoJS.enc.Utf8.parse(jsonString);

      let encrypted = CryptoJS.AES.encrypt(utf8String, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).ciphertext.toString();

      return Base64.encode(encrypted);
    }
    async function getFirstThreeDigits(number) {
      return String(number).slice(0, 3);
    }
    async function getAesvByiddui() {
      let config = {
        method: "GET",
        url: "https://10010.woread.com.cn/ng_woread_service/rest/phone/vouchers/getSysConfig",
        // url: "https://10010.woread.com.cn/ng_woread_service/rest/phone/vouchers/queryTicketAccount",
        headers: {
          "User-Agent": ua,
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          pragma: "no-cache",
          "cache-control": "no-cache",
          "sec-ch-ua":
            '"Not/A)Brand";v="8", "Chromium";v="126", "Android WebView";v="126"',
          accesstoken: "ODZERTZCMjA1NTg1MTFFNDNFMThDRDYw",
          "content-type": "application/json;charset=UTF-8",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          origin: "https://10010.woread.com.cn",
          "x-requested-with": "com.sinovatech.unicom.ui",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: "https://10010.woread.com.cn/ng_woread/",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          priority: "u=1, i",
        },
      };

      try {
        const response = await axios.request(config);
        const activeIdValue = response.data.list[0].activityId;
        // console.log("当前活动:" + activeIdValue);
        // await processTaskId("yueduActiveId", activeIdValue, "当前月份的ActiveID");
        return activeIdValue;
      } catch (error) {
        console.error("Error:", error);
      }
    }
    async function getBody(phoneV) {
      const d = Object.assign;
      const e = { data: { phone:await getAesphone(phoneV,"woreadst^&*12345") } };

      const result = await getAes(
        d({}, e.data, {
          timestamp: new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/[-:T]/g, "")
            .substring(0, 14),
        }),
        key,
      );
      const data = JSON.stringify({
        sign: result,
      });
      const options = {
        method: "POST",
        url: "https://10010.woread.com.cn/ng_woread_service/rest/account/login",
        headers: {
          "User-Agent": ua,
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          "sec-ch-ua":
            '"Android WebView";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
          accesstoken: "ODZERTZCMjA1NTg1MTFFNDNFMThDRDYw",
          "Content-Type": "application/json;charset=UTF-8",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          Origin: "https://10010.woread.com.cn",
          "X-Requested-With": "com.sinovatech.unicom.ui",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: "https://10010.woread.com.cn/ng_woread/",
          "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        body: data,
      };
      try {
        const body = await new Promise((resolve, reject) => {
          request(options, function (error, response, body) {
            if (error) {
              return reject(error);
            }
            resolve(body);
          });
        });
        return body;
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
    async function formatTimeWithMoment(date) {
      return moment(date).format("HH:mm:ss:SSS");
    }

    async function getAesvByactiveId(body, idDui) {
      // console.log(idDui);
      body = JSON.parse(body);
      const token = body.data.token;
      const userId = body.data.userid;
      const userIndex = body.data.userindex;
      const userAccount = body.data.phone;
      const verifyCode = body.data.verifycode;

      const d1 = Object.assign;
      const result1 = await getAes(
        d1(
          {},
          {
            timestamp: new Date()
              .toISOString()
              .slice(0, 19)
              .replace(/[-:T]/g, "")
              .substring(0, 14),
            token: token,
            userAccount: userAccount,
            userId: userId,
            userIndex: userIndex,
            verifyCode: verifyCode,
          },
        ),
        key,
      );

      // console.log(result1);
      let data = JSON.stringify({
        sign: result1,
      });
      let config = {
        method: "POST",
        url: "https://10010.woread.com.cn/ng_woread_service/rest/phone/vouchers/queryTicketAccount",
        headers: {
          "User-Agent": ua,
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          pragma: "no-cache",
          "cache-control": "no-cache",
          "sec-ch-ua":
            '"Not/A)Brand";v="8", "Chromium";v="126", "Android WebView";v="126"',
          accesstoken: "ODZERTZCMjA1NTg1MTFFNDNFMThDRDYw",
          "content-type": "application/json;charset=UTF-8",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          origin: "https://10010.woread.com.cn",
          "x-requested-with": "com.sinovatech.unicom.ui",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: "https://10010.woread.com.cn/ng_woread/",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          priority: "u=1, i",
        },
        data: data,
      };

      try {
        const response = await axios.request(config);
        const activeIdValue = response.data.data.usableNum;
        console.log(
          "当前" + (await getFirstThreeDigits(userAccount)) + "可兑换的余额为:",
          activeIdValue / 100,
        );
        if (activeIdValue < 200) {
          console.log(
            "当前" +
              (await getFirstThreeDigits(userAccount)) +
              "余额不足2快，无法兑换",
          );
          return;
        }
        duiNum = 500;
        istrue = true;
        while (activeIdValue >= duiNum && istrue) {
          console.log(
            "当前" +
              (await getFirstThreeDigits(userAccount)) +
              "余额大于5.开始兑换",
          );
          await getAesvBydui(body, duiNum, idDui);
          istrue = false;
          break;
          // return activeIdValue;
        }
        duiNum = 200;
        while (activeIdValue >= duiNum && istrue) {
          console.log(
            "当前" +
              (await getFirstThreeDigits(userAccount)) +
              "余额大于2.开始兑换",
          );
          await getAesvBydui(body, duiNum, idDui);
          // return activeIdValue;
          break;
        }
        const response2 = await axios.request(config);
        const activeIdValue2 = response.data.data.usableNum;
        console.log(
          "当前" + (await getFirstThreeDigits(userAccount)) + "可兑换的余额为:",
          activeIdValue2 / 100,
        );
        return activeIdValue;
      } catch (error) {
        console.error("Error:", error);
      }
    }
    async function getAesvBydui(body, duiNum, idDui) {
      // body = JSON.parse(body);
      const token = body.data.token;
      const userId = body.data.userid;
      const userIndex = body.data.userindex;
      const userAccount = body.data.phone;
      const verifyCode = body.data.verifycode;

      const d1 = Object.assign;
      const result1 = await getAes(
        d1(
          {},
          {
            activeid: idDui,
            ticketValue: duiNum,
            timestamp: new Date()
              .toISOString()
              .slice(0, 19)
              .replace(/[-:T]/g, "")
              .substring(0, 14),
            token: token,
            userAccount: userAccount,
            userId: userId,
            userIndex: userIndex,
            verifyCode: verifyCode,
          },
        ),
        key,
      );
      let data = JSON.stringify({
        sign: result1,
      });
      let config = {
        method: "POST",
        url: "https://10010.woread.com.cn/ng_woread_service/rest/phone/vouchers/exchange",
        headers: {
          "User-Agent": ua,
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          pragma: "no-cache",
          "cache-control": "no-cache",
          "sec-ch-ua":
            '"Not/A)Brand";v="8", "Chromium";v="126", "Android WebView";v="126"',
          accesstoken: "ODZERTZCMjA1NTg1MTFFNDNFMThDRDYw",
          "content-type": "application/json;charset=UTF-8",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          origin: "https://10010.woread.com.cn",
          "x-requested-with": "com.sinovatech.unicom.ui",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: "https://10010.woread.com.cn/ng_woread/",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          priority: "u=1, i",
        },
        data: data,
      };

      try {
        const response = await axios.request(config);
        if (response.data.code == "9999") {
          console.log(
            "当前" +
              (await getFirstThreeDigits(userAccount)) +
              response.data.message,
          );
        } else {
          const activeIdValue = response.data.data.usableNum;
          console.log("兑换成功");
          console.log(
            "当前" +
              (await getFirstThreeDigits(userAccount)) +
              "可兑换的余额为:",
            activeIdValue / 100,
          );
          // await processTaskId("yueduActiveId", activeIdValue, "当前月份的ActiveID");
          return activeIdValue;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    !(async () => {
      const body = await getBody(phoneV);
      idDui = await getAesvByiddui(body);
      const activeid = await getAesvByactiveId(body, idDui);
    })();

    async function processTaskId(name, value, envRemark) {
      value = String(value);
      const result3 = await envManager.updateOrCreateEnv(
        name, // 变量名称
        value, // 变量值
        envRemark, // 备注
      );
      console.log("更新或创建环境变量结果:", result3);
      if (result3) {
        console.log("添加操作成功");
        return true;
      } else {
        console.log("添加操作成功");
        return false;
      }
    }
  }, 500 * index);
});

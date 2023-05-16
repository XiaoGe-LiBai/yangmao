/*
环境变量dyjsb

只需要sessionid的值

填入变量内   多账户换行隔开就可以了
*/
const $ = new Env("抖音极速版");
let envSplitor = ["\n"];
let defaultUA = "";
let httpResult,
  httpReq,
  httpResp,
  userCookie =($.isNode() ? process.env.dyjsb : $.getdata("dyjsb")) ||``,
  userList = [],
  userIdx = 0,
  userCount = 0;
class UserInfo {
  constructor(str) {
    this.index = ++userIdx;
    this.name = this.index;
    this.valid = false;
    this.canRead = false;
    try {
      this.sessionid = str;
      this.param = $.str2json(str);
      this.ckValid = true;
    } catch (err) {
      this.ckValid = false;
      $.logAndNotify("账号[" + this.index + "]CK格式错误");
    }
  }
  async ["my"]() {
    try {
      let url = "https://api5-normal-c-lf.amemv.com/luckycat/aweme/v1/task/page?iid=" + this.param.iid + "&device_id=" + this.param.did + "&app_name=douyin_lite&version_name=23.7.0&aid=2329",
        body = "",
        ck = "sessionid=" + this.sessionid,
        userpd = populateUrlObject(url, ck, body);
      await httpRequest("get", userpd);
      let result = httpResult;
      if (!result) return;
      if (result.err_no == 0) {
        $.logAndNotify("账号[" + this.name + "]今日金币收入:" + result.data.income_data.amount1 + " 余额:" + result.data.income_data.amount2 / 100 + "元");
        this.valid = true;
        this.canRead = true;
      } else {
        $.logAndNotify("账号[" + this.name + "]你传的参数无效");
      }
    } catch (err) {
    } finally {
      return Promise.resolve(1);
    }
  }
  async ["sign_in"]() {
    try {
      let url = "https://api5-normal-c-lf.amemv.com/luckycat/aweme/v1/task/done/sign_in?iid=" + this.param.iid + "&device_id=" + this.param.did + "&aid=2329&app_name=douyin_lite&version_name=23.7.0",
        bd = "{}",
        ck = "sessionid=" + this.sessionid,
        pd = populateUrlObject(url, ck, bd);
      await httpRequest("post", pd);
      let result = httpResult;
      if (!result) return;
      if (result.err_no == 0) {
        $.logAndNotify("账号[" + this.name + "]" + result.data.content + "获得:" + result.data.amount + "金币");
        this.amount = result.data.amount;
        await this.detail();
        await this.openbox();
      } else {
        $.logAndNotify("账号[" + this.name + "]签到: " + result.err_tips);
        if (result.err_tips == "签到已完成") {
          await this.openbox();
        }
      }
    } catch (err) {
    } finally {
      return Promise.resolve(1);
    }
  }
  async ["detail"]() {
    try {
      let url = "https://api5-normal-c-lf.amemv.com/luckycat/aweme/v1/task/sign_in/detail?iid=" + this.param.iid + "&device_id=" + this.param.did + "&app_name=douyin_lite&version_name=23.7.0&aid=2329",
        bd = "",
        ck = "sessionid=" + this.sessionid,
        pd = populateUrlObject(url, ck, bd);
      await httpRequest("get", pd);
      let result = httpResult;
      if (!result) return;
      this.req_id = result.data.excitation_ad_info.req_id;
      this.ad_id = result.data.excitation_ad_info.ad_id;
      this.score_amount = result.data.excitation_ad_info.score_amount;
      $.logAndNotify("账号[" + this.name + "]获取广告参数成功! 预计可获得:" + this.score_amount + "金币");
      await this.done_eat();
    } catch (_0x5e5381) {
      console.log(_0x5e5381);
    } finally {
      return Promise.resolve(1);
    }
  }
  async ["done_eat"]() {
    try {
      let url = "https://api5-normal-lf.toutiaoapi.com/luckycat/lite/v1/eat/done_eat/?device_id=2184055137776279&aid=35&iid=4295117463628087",
        _0x119fda = '{"task_key":"excitation_ad_signin","amount":"' + this.score_amount + '","ad_rit":"' + this.ad_id + '","ad_inspire":"{"score_amount":"' + this.score_amount + '","amount":"' + this.amount + '","req_id":"' + this.req_id + '"}","ad_alias_position":"check_in","timeout":4000}',
        _0x425d3c = "sessionid=" + this.sessionid,
        _0x1a67cc = populateUrlObject(url, _0x425d3c, _0x119fda);
      await httpRequest("post", _0x1a67cc);
      let _0x2f0ccf = httpResult;
      if (!_0x2f0ccf) return;
      if (_0x2f0ccf.err_no == 0) {
        $.logAndNotify("账号[" + this.name + "]签到广告: 获得" + _0x2f0ccf.data.amount + "金币");
      } else $.logAndNotify("账号[" + this.name + "]签到广告: " + _0x2f0ccf.err_tips);
    } catch (_0x2f2c78) {
      console.log(_0x2f2c78);
    } finally {
      return Promise.resolve(1);
    }
  }
  async openbox() {
    this.p = 0;
    var a = 0;
    console.log("账号[" + this.name + "]" + `开始无上限开宝箱 每轮50次并发 直到成功打开宝箱`);
    while (1) {
      a++;
      const element = [];
      for (let index = 0; index < 50; index++) {
        element.push(this.openbox2());
      }
      await Promise.allSettled(element);
      if (this.p == 1) break;
    }
  }
  async ["openbox2"]() {
    try {
      let url = "https://api5-normal-c-lf.amemv.com/luckycat/aweme/v1/task/done/treasure_task?_request_from=web&iid=" + this.param.iid + "&device_id=" + this.param.did + "&aid=2329&app_name=douyin_lite&device_platform=android&dpi=411&update_version_code=14709901",
        body = "{}",
        _0x414788 = "sessionid=" + this.sessionid,
        _0x5843ab = populateUrlObject(url, _0x414788, body);
      await httpRequest("post", _0x5843ab);
      let result = httpResult;
      if (!result) return;
      if (result.err_tips == "很遗憾，奖励溜走了") {
      } else {
        if (result.err_no == 0) {
          this.p = 1;
          $.logAndNotify("账号[" + this.name + "]开宝箱: 获得" + result.data.amount + "金币 看广告预计可获得:" + result.data.excitation_ad_info.score_amount + "金币");
          this.req_id = result.data.excitation_ad_info.req_id;
          this.score_amount = result.data.excitation_ad_info.score_amount;
          this.amount = result.data.amount;
          this.ad_id = result.data.excitation_ad_info.ad_id;
          this.pw = 0;
          var ac = 0;
          console.log("账号[" + this.name + "]" + `开始无上限看宝箱广告 每轮50次并发 直到成功观看广告`);
          while (1) {
            ac++;
            const element = [];
            for (let index = 0; index < 50; index++) {
              element.push(this.excitation_ad_treasure_box());
            }
            await Promise.allSettled(element);
            if (this.pw == 1) break;
          }
        } else {
          if (result.err_tips == "您已经开过宝箱了喔，请稍后再试") {
            if (!this.p) $.logAndNotify("账号[" + this.name + "]开宝箱失败了: " + result.err_tips);
            this.p = 1;
          }
        }
      }
    } catch (_0x353356) {
      console.log(_0x353356);
    } finally {
      return Promise.resolve(1);
    }
  }
  async ["excitation_ad_treasure_box"]() {
    try {
      let url = "https://api5-normal-c-lf.amemv.com/luckycat/aweme/v1/task/done/excitation_ad_treasure_box?iid=" + this.param.iid + "&device_id=" + this.param.did + "&aid=2329&app_name=douyin_lite&device_platform=android&update_version_code=14709901",
        body = '{"task_key":"excitation_ad_treasure_box","amount":"' + this.score_amount + '","ad_rit":"' + this.ad_id + '","ad_inspire":"{"score_amount":"' + this.score_amount + '","amount":"' + this.amount + '","req_id":"' + this.req_id + '"}","ad_alias_position":"box","timeout":4000}',
        ck = "sessionid=" + this.sessionid,
        userpd = populateUrlObject(url, ck, body);
      await httpRequest("post", userpd);
      let result = httpResult;
      if (!result) return;
      if (result.err_tips == "很遗憾，金币溜走了～") {
      } else if (result.err_no == 0) {
        this.pw = 1;
        console.log("账号[" + this.name + "]宝箱广告: 获得" + result.data.amount + "金币");
      }
    } catch (_0x529ea6) {
      console.log(_0x529ea6);
    } finally {
      return Promise.resolve(1);
    }
  }
  async ["ad"]() {
    try {
      let _0x21444e = "https://api5-normal-c-lf.amemv.com/luckycat/aweme/v1/task/done/excitation_ad?_request_from=web&iid=" + this.param.iid + "&device_id=" + this.param.did + "&aid=2329&app_name=douyin_lite&device_platform=android&dpi=411&update_version_code=14709901",
        _0x256c5e = '{"task_key":"excitation_ad","amount":"72","ad_rit":"12315","ad_inspire":"{"score_amount":"72","req_id":"20230413215357BBF890B249C35F1A6BBF"}","ad_alias_position":"task","timeout":4000}',
        _0x4beee6 = "sessionid=" + this.sessionid,
        _0x42c356 = populateUrlObject(_0x21444e, _0x4beee6, _0x256c5e);
      await httpRequest("post", _0x42c356);
      let result = httpResult;
      if (!result) return;
      result.err_no == 10007 && (await this.ad());
      result.err_no == 0 ? ($.logAndNotify("账号[" + this.name + "]看广告: 获得" + result.data.amount + "金币"), await this.one_more()) : $.logAndNotify("账号[" + this.name + "]看广告: " + result.err_tips);
    } catch (_0x2112aa) {
      console.log(_0x2112aa);
    } finally {
      return Promise.resolve(1);
    }
  }
  async ["one_more"]() {
    try {
      let _0x5be64a = "https://aweme.snssdk.com/luckycat/aweme/v1/task/done/excitation_ad/one_more?_request_from=web&iid=" + this.param.iid + "&device_id=" + this.param.did + "&aid=2329&app_name=douyin_lite&device_platform=android&dpi=411&update_version_code=14709901",
        _0x50bfb6 = '{"task_key":"excitation_ad","rit":"28038","creator_id":"12315000"}',
        _0x4a7f79 = "sessionid=" + this.sessionid,
        _0x150755 = populateUrlObject(_0x5be64a, _0x4a7f79, _0x50bfb6);
      await httpRequest("post", _0x150755);
      let result = httpResult;
      if (!result) return;
      if (result.err_tips == 10007) {
        await this.one_more();
      } else result.err_no == 0 ? $.logAndNotify("账号[" + this.name + "]广告追加: 获得" + result.data.amount + "金币") : $.logAndNotify("账号[" + this.name + "]广告追加: " + result.err_tips);
    } catch (_0x25e7be) {
      console.log(_0x25e7be);
    } finally {
      return Promise.resolve(1);
    }
  }
}
!(async () => {
  if (typeof $request !== "undefined") {
  } else {
    if (!(await checkEnv())) return;
    let taskall = [],
      userlist = userList.filter((us) => us.ckValid);
    $.logAndNotify("\n-------------- 账号检测 --------------");
    taskall = [];
    for (let user of userlist) {
      taskall.push(user.my());
    }
    await Promise.all(taskall);
    userlist = userlist.filter((us) => us.valid);
    $.logAndNotify("\n-------------- 天天赚金币 --------------");
    taskall = [];
    for (let user of userlist.filter((us) => us.canRead)) {
      taskall.push(user.sign_in());
    }
    await Promise.all(taskall);
  }
})()
  .catch((_0x38dd20) => console.log(_0x38dd20))
  .finally(() => $.done());

async function checkEnv() {
  if (userCookie) {
    let cook = envSplitor[0];
    for (let envc of envSplitor) {
      if (userCookie.indexOf(envc) > -1) {
        cook = envc;
        break;
      }
    }
    for (let ck of userCookie.split(cook)) {
      if (ck) userList.push(new UserInfo(ck));
    }
    userCount = userList.length;
  } else {
    console.log("\n未找到CK 请阅读脚本说明");
    return;
  }
  return console.log("共找到" + userCount + "个账号"), true;
}

function populateUrlObject(url, ck, body = "") {
  let _0xeab3e5 = url.replace("//", "/").split("/")[1],
    hd = {
      url: url,
      headers: {
        Host: _0xeab3e5,
        cookie: ck,
        "User-Agent": defaultUA,
      },
      timeout: 10000,
    };
  return body && ((hd.body = body), (hd.headers["content-type"] = "application/json; charset=utf-8"), (hd.headers["Content-Length"] = hd.body ? hd.body.length : 0)), hd;
}

async function httpRequest(_0xfdf393, _0x51de5f) {
  return (
    (httpResult = null),
    (httpReq = null),
    (httpResp = null),
    new Promise((_0x2ea520) => {
      $.send(_0xfdf393, _0x51de5f, async (_0x13610d, _0x2d1797, _0xc7aa13) => {
        try {
          httpReq = _0x2d1797;
          httpResp = _0xc7aa13;
          if (_0x13610d) httpResult = JSON.parse(_0x2d1797.body);
          else {
            if (_0xc7aa13.body) {
              if (typeof _0xc7aa13.body == "object") httpResult = _0xc7aa13.body;
              else {
                try {
                  httpResult = JSON.parse(_0xc7aa13.body);
                } catch (_0x3bbf17) {
                  httpResult = _0xc7aa13.body;
                }
              }
            }
          }
        } catch (_0x23f7c6) {
        } finally {
          _0x2ea520();
        }
      });
    })
  );
}
////////////////////////////////////////////////////////////////////
function Env(name, env) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  return new (class {
    constructor(name, env) {
      this.name = name;
      this.notifyStr = "";
      this.startTime = new Date().getTime();
      Object.assign(this, env);
      console.log(`${this.name} 开始运行：`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
          r = s ? this.getval(s) : "";
        if (r)
          try {
            const t = JSON.parse(r);
            e = t ? this.lodash_get(t, i, "") : e;
          } catch (t) {
            e = "";
          }
      }
      return e;
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
          o = this.getval(i),
          h = i ? ("null" === o ? null : o || "{}") : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), (s = this.setval(JSON.stringify(e), i));
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), (s = this.setval(JSON.stringify(o), i));
        }
      } else {
        s = this.setval(t, e);
      }
      return s;
    }
    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? ((this.data = this.loaddata()), this.data[t]) : (this.data && this.data[t]) || null;
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? ((this.data = this.loaddata()), (this.data[e] = t), this.writedata(), !0) : (this.data && this.data[e]) || null;
    }
    send(m, t, e = () => {}) {
      if (m != "get" && m != "post" && m != "put" && m != "delete") {
        console.log(`无效的http方法：${m}`);
        return;
      }
      if (m == "get" && t.headers) {
        delete t.headers["content-type"];
        delete t.headers["Content-Length"];
      } else if (t.body && t.headers) {
        if (!t.headers["content-type"]) t.headers["content-type"] = "application/json";
      }
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          t.headers = t.headers || {};
          Object.assign(t.headers, {
            "X-Surge-Skip-Scripting": !1,
          });
        }
        let conf = {
          method: m,
          url: t.url,
          headers: t.headers,
          timeout: t.timeout,
          data: t.body,
        };
        if (m == "get") delete conf.data;
        $axios(conf)
          .then((t) => {
            const { status: i, request: q, headers: r, data: o } = t;
            e(null, q, {
              statusCode: i,
              headers: r,
              body: o,
            });
          })
          .catch((err) => console.log(err));
      } else if (this.isQuanX()) {
        (t.method = m.toUpperCase()),
          this.isNeedRewrite &&
            ((t.opts = t.opts || {}),
            Object.assign(t.opts, {
              hints: !1,
            })),
          $task.fetch(t).then(
            (t) => {
              const { statusCode: i, request: q, headers: r, body: o } = t;
              e(null, q, {
                statusCode: i,
                headers: r,
                body: o,
              });
            },
            (t) => e(t)
          );
      } else if (this.isNode()) {
        this.got = this.got ? this.got : require("got");
        const { url: s, ...i } = t;
        this.instance = this.got.extend({
          followRedirect: false,
        });
        this.instance[m](s, i).then(
          (t) => {
            const { statusCode: i, request: q, headers: r, body: o } = t;
            e(null, q, {
              statusCode: i,
              headers: r,
              body: o,
            });
          },
          (t) => {
            const { message: s, response: i } = t;
            e(s, i, i && i.body);
          }
        );
      }
    }
    time(t) {
      let e = {
        "M+": new Date().getMonth() + 1,
        "d+": new Date().getDate(),
        "h+": new Date().getHours(),
        "m+": new Date().getMinutes(),
        "s+": new Date().getSeconds(),
        "q+": Math.floor((new Date().getMonth() + 3) / 3),
        S: new Date().getMilliseconds(),
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (new Date().getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
      return t;
    }
    async showmsg() {
      if (!this.notifyStr) return;
      let notifyBody = this.name + " 运行通知\n\n" + this.notifyStr;
      if ($.isNode()) {
        var notify = require("./sendNotify");
        console.log("\n============== 推送 ==============");
        await notify.sendNotify(this.name, notifyBody);
      } else {
        this.msg(notifyBody);
      }
    }
    logAndNotify(str) {
      console.log(str);
      this.notifyStr += str;
      this.notifyStr += "\n";
    }
    msg(e = t, s = "", i = "", r) {
      const o = (t) => {
        if (!t) return t;
        if ("string" == typeof t)
          return this.isLoon()
            ? t
            : this.isQuanX()
            ? {
                "open-url": t,
              }
            : this.isSurge()
            ? {
                url: t,
              }
            : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s,
            };
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s,
            };
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e,
            };
          }
        }
      };
      this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
      let h = ["", "============== 系统通知 =============="];
      h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n"));
    }
    getMin(a, b) {
      return a < b ? a : b;
    }
    getMax(a, b) {
      return a < b ? b : a;
    }
    padStr(num, length, padding = "0") {
      let numStr = String(num);
      let numPad = length > numStr.length ? length - numStr.length : 0;
      let retStr = "";
      for (let i = 0; i < numPad; i++) {
        retStr += padding;
      }
      retStr += numStr;
      return retStr;
    }
    json2str(obj, c, encodeUrl = false) {
      let ret = [];
      for (let keys of Object.keys(obj).sort()) {
        let v = obj[keys];
        if (v && encodeUrl) v = encodeURIComponent(v);
        ret.push(keys + "=" + v);
      }
      return ret.join(c);
    }
    str2json(str, decodeUrl = false) {
      let ret = {};
      for (let item of str.split("&")) {
        if (!item) continue;
        let idx = item.indexOf("=");
        if (idx == -1) continue;
        let k = item.substr(0, idx);
        let v = item.substr(idx + 1);
        if (decodeUrl) v = decodeURIComponent(v);
        ret[k] = v;
      }
      return ret;
    }
    randomString(len, charset = "abcdef0123456789") {
      let str = "";
      for (let i = 0; i < len; i++) {
        str += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return str;
    }
    randomList(a) {
      let idx = Math.floor(Math.random() * a.length);
      return a[idx];
    }
    wait(t) {
      return new Promise((e) => setTimeout(e, t));
    }
    done(t = {}) {
      const e = new Date().getTime(),
        s = (e - this.startTime) / 1e3;
      console.log(`\n${this.name} 运行结束，共运行了 ${s} 秒！`);
      if (this.isSurge() || this.isQuanX() || this.isLoon()) $done(t);
    }
  })(name, env);
}

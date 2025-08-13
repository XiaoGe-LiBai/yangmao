/*
cron "0 9 * * *" emsyhzx.js
export EMSYHZX_OPENID='第一个openId&第二个openId'
微信小程序:EMS中国邮政速递物流
*/

const $ = new Env('EMS邮惠中心');
const notify = $.isNode() ? require('../sendNotify') : '';
const EMSYHZX_OPENID = ($.isNode() ? process.env.EMSYHZX_OPENID : $.getdata("EMSYHZX_OPENID")) || '';

let token = '', userId = '';
let notice = '';
const maxRetries = 3; // 网络请求重试次数

// 完整 Env 类，确保兼容性
function Env(name, opts) {
  class Http {
    constructor(env) {
      this.env = env
    }

    send(opts, method = 'GET') {
      opts = typeof opts === 'string' ? { url: opts } : opts
      let sender = this.get
      if (method === 'POST') {
        sender = this.post
      }
      return new Promise((resolve, reject) => {
        sender.call(this, opts, (err, resp, body) => {
          if (err) reject(err)
          else resolve(resp)
        })
      })
    }

    get(opts) {
      return this.send.call(this.env, opts)
    }

    post(opts) {
      return this.send.call(this.env, opts, 'POST')
    }
  }

  return new (class {
    constructor(name, opts) {
      this.name = name
      this.http = new Http(this)
      this.data = null
      this.dataFile = 'box.dat'
      this.logs = []
      this.isMute = false
      this.isNeedRewrite = false
      this.logSeparator = '\n'
      this.encoding = 'utf-8'
      this.startTime = new Date().getTime()
      Object.assign(this, opts)
      this.log('', `🔔${this.name}, 开始!`)
    }

    isNode() {
      return 'undefined' !== typeof module && !!module.exports
    }

    isQuanX() {
      return 'undefined' !== typeof $task
    }

    isSurge() {
      return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
    }

    isLoon() {
      return 'undefined' !== typeof $loon
    }

    toObj(str, defaultValue = null) {
      try {
        return JSON.parse(str)
      } catch {
        return defaultValue
      }
    }

    toStr(obj, defaultValue = null) {
      try {
        return JSON.stringify(obj)
      } catch {
        return defaultValue
      }
    }

    getjson(key, defaultValue) {
      let json = defaultValue
      const val = this.getdata(key)
      if (val) {
        try {
          json = JSON.parse(this.getdata(key))
        } catch {}
      }
      return json
    }

    setjson(value, key) {
      try {
        return this.setdata(JSON.stringify(value), key)
      } catch {
        return false
      }
    }

    getScript(url) {
      return new Promise((resolve) => {
        this.get({ url }, (err, resp, body) => resolve(body))
      })
    }

    runScript(script, runOpts) {
      return new Promise((resolve) => {
        let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
        httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
        let httpapi_timeout = this.getdata(
          '@chavy_boxjs_userCfgs.httpapi_timeout'
        )
        httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
        httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
        const [key, addr] = httpapi.split('@')
        const opts = {
          url: `http://${addr}/v1/scripting/evaluate`,
          body: {
            script_text: script,
            mock_type: 'cron',
            timeout: httpapi_timeout
          },
          headers: { 'X-Key': key, 'Accept': '*/*' }
        }
        this.post(opts, (err, resp, body) => resolve(body))
      }).catch((e) => this.logErr(e))
    }

    loaddata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require('fs')
        this.path = this.path ? this.path : require('path')
        const curDirDataFilePath = this.path.resolve(this.dataFile)
        const rootDirDataFilePath = this.path.resolve(
          process.cwd(),
          this.dataFile
        )
        const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
        const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
        if (isCurDirDataFile || isRootDirDataFile) {
          const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
          try {
            return JSON.parse(this.fs.readFileSync(datPath))
          } catch (e) {
            return {}
          }
        } else return {}
      } else return {}
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require('fs')
        this.path = this.path ? this.path : require('path')
        const curDirDataFilePath = this.path.resolve(this.dataFile)
        const rootDirDataFilePath = this.path.resolve(
          process.cwd(),
          this.dataFile
        )
        const jsondata = JSON.stringify(this.data)
        this.fs.writeFileSync(curDirDataFilePath, jsondata)

      }
    }
    lodash_get(source, path, defaultValue = undefined) {
      const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
      let result = source
      for (const p of paths) {
        result = Object(result)[p]
        if (result === undefined) {
          return defaultValue
        }
      }
      return result
    }

    lodash_set(obj, path, value) {
      if (Object(obj) !== obj) return obj
      if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
      path
        .slice(0, -1)
        .reduce(
          (a, c, i) =>
            Object(a[c]) === a[c]
              ? a[c]
              : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
          obj
        )[path[path.length - 1]] = value
      return obj
    }

    getdata(key) {
      let val = this.getval(key)
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
        const obj = objkey ? this.getval(objkey) : ''
        if (obj) {
          try {
            const arr = JSON.parse(obj)
            val = arr ? this.lodash_get(arr, paths, '') : val
          } catch (e) {
            val = ''
          }
        }
      }
      return val
    }

    setdata(val, key) {
      let success = false
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
        const obj = this.getval(objkey)
        const arr = obj ? JSON.parse(obj) : []
        this.lodash_set(arr, paths, val)
        success = this.setval(JSON.stringify(arr), objkey)
      } else {
        success = this.setval(val, key)
      }
      return success
    }

    getval(key) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.read(key)
      } else if (this.isQuanX()) {
        return $prefs.valueForKey(key)
      } else if (this.isNode()) {
        this.data = this.loaddata()
        return this.data[key]
      } else {
        return (this.data && this.data[key]) || null
      }
    }

    setval(val, key) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.write(val, key)
      } else if (this.isQuanX()) {
        return $prefs.setValueForKey(val, key)
      } else if (this.isNode()) {
        this.data = this.loaddata()
        this.data[key] = val
        this.writedata()
        return true
      } else {
        return (this.data && (this.data[key] = val)) || false
      }
    }

    initGotEnv(opts) {
      this.got = this.got ? this.got : require('got')
      this.cktough = this.cktough ? this.cktough : require('tough-cookie')
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
      if (opts) {
        opts.headers = opts.headers ? opts.headers : {}
        if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
          opts.cookieJar = this.ckjar
        }
      }
    }

    get(opts, callback = () => {}) {
      if (opts.headers) {
        delete opts.headers['Content-Type']
        delete opts.headers['Content-Length']
      }
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          opts.headers = opts.headers || {}
          Object.assign(opts.headers, { 'X-Surge-Skip-Scripting': false })
        }
        $httpClient.get(opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body
            resp.statusCode = resp.status
          }
          callback(err, resp, body)
        })
      } else if (this.isQuanX()) {
        if (this.isNeedRewrite) {
          opts.opts = opts.opts || {}
          Object.assign(opts.opts, { hints: false })
        }
        $task.fetch(opts).then(
          (resp) => {
            const { statusCode: status, statusCode, headers, body } = resp
            callback(null, { status, statusCode, headers, body }, body)
          },
          (err) => callback(err)
        )
      } else if (this.isNode()) {
        this.initGotEnv(opts)
        this.got(opts)
          .on('redirect', (resp, nextOpts) => {
            try {
              if (resp.headers['set-cookie']) {
                const ck = resp.headers['set-cookie']
                  .map(this.cktough.Cookie.parse)
                  .toString()
                if (ck) {
                  this.ckjar.setCookieSync(ck, null)
                }
                nextOpts.cookieJar = this.ckjar
              }
            } catch (e) {
              this.logErr(e)
            }
          })
          .then(
            (resp) => {
              const { statusCode, headers, body } = resp
              callback(null, { statusCode, headers, body }, body)
            },
            (err) => {
              const { message: error, response: resp } = err
              callback(error, resp, resp && resp.body)
            }
          )
      }
    }

    post(opts, callback = () => {}) {
      const method = opts.method ? opts.method.toLocaleLowerCase() : 'post'
      if (opts.body && opts.headers && !opts.headers['Content-Type']) {
        opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
      if (opts.headers) delete opts.headers['Content-Length']
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          opts.headers = opts.headers || {}
          Object.assign(opts.headers, { 'X-Surge-Skip-Scripting': false })
        }
        $httpClient[method](opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body
            resp.statusCode = resp.status
          }
          callback(err, resp, body)
        })
      } else if (this.isQuanX()) {
        opts.method = method
        if (this.isNeedRewrite) {
          opts.opts = opts.opts || {}
          Object.assign(opts.opts, { hints: false })
        }
        $task.fetch(opts).then(
          (resp) => {
            const { statusCode: status, statusCode, headers, body } = resp
            callback(null, { status, statusCode, headers, body }, body)
          },
          (err) => callback(err)
        )
      } else if (this.isNode()) {
        this.initGotEnv(opts)
        const { url, ..._opts } = opts
        this.got[method](url, _opts).then(
          (resp) => {
            const { statusCode, headers, body } = resp
            callback(null, { statusCode, headers, body }, body)
          },
          (err) => {
            const { message: error, response: resp } = err
            callback(error, resp, resp && resp.body)
          }
        )
      }
    }

    time(format, ts = null) {
      const date = ts ? new Date(ts) : new Date()
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(format))
        format = format.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      for (let k in o)
        if (new RegExp('(' + k + ')').test(format))
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )
      return format
    }

    msg(title = name, subt = '', desc = '', opts) {
      const toEnvOpts = (rawopts) => {
        if (!rawopts) return rawopts
        if (typeof rawopts === 'string') {
          if (this.isLoon()) return rawopts
          else if (this.isQuanX()) return { 'open-url': rawopts }
          else if (this.isSurge()) return { url: rawopts }
          else return undefined
        } else if (typeof rawopts === 'object') {
          if (this.isLoon()) {
            let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
            let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
            return { openUrl, mediaUrl }
          } else if (this.isQuanX()) {
            let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
            let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
            let updatePasteboard =
              rawopts['update-pasteboard'] || rawopts.updatePasteboard
            return {
              'open-url': openUrl,
              'media-url': mediaUrl,
              'update-pasteboard': updatePasteboard
            }
          } else if (this.isSurge()) {
            let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
            return { url: openUrl }
          }
        } else {
          return undefined
        }
      }
      if (!this.isMute) {
        if (this.isSurge() || this.isLoon()) {
          $notification.post(title, subt, desc, toEnvOpts(opts))
        } else if (this.isQuanX()) {
          $notify(title, subt, desc, toEnvOpts(opts))
        }
      }
      if (!this.isMuteLog) {
        let logs = ['', '==============📣系统通知📣==============']
        logs.push(title)
        subt ? logs.push(subt) : ''
        desc ? logs.push(desc) : ''
        console.log(logs.join('\n'))
        this.logs = this.logs.concat(logs)
      }
    }

    log(...logs) {
      if (logs.length > 0) {
        this.logs = [...this.logs, ...logs]
      }
      console.log(logs.join(this.logSeparator))
    }

    logErr(err, msg) {
      const isPrintErr = !this.isMuteErr
      if (isPrintErr) {
        const error = err.stack ? err.stack : err
        console.log(`❗️${this.name}, 错误!`, error)
      }
    }

    wait(time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    }

    done(val = {}) {
      const endTime = new Date().getTime()
      const costTime = (endTime - this.startTime) / 1000
      this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
      this.log()
      if (this.isSurge() || this.isLoon()) {
        $done(val)
      } else if (this.isQuanX()) {
        $done(val)
      }
    }
  })(name, opts)
}

!(async () => {
    await getNotice();
    await main();
})().catch((e) => { $.log(e) }).finally(() => { $.done({}); });

async function main() {
    if (!EMSYHZX_OPENID) {
        $.log('请设置环境变量 EMSYHZX_OPENID');
        return;
    }
    
    let allUserNotice = '';
    const user_list = EMSYHZX_OPENID.split('&');
    
    for (const [index, openId] of user_list.entries()) {
        try {
            if (!openId) continue;
            
            notice = `\n--- 账号 ${index + 1} (${openId.slice(0, 10)}...) ---\n`;
            console.log(`\n--- 正在执行账号 ${index + 1} ---`);

            // 重置会话变量
            token = '';
            userId = '';
            
            const loginSuccess = await userLogin(openId);
            if (!loginSuccess) {
                allUserNotice += notice;
                await $.wait(2000); // 随机等待
                continue;
            }

            await $.wait(1000);
            await userSign(openId);
            
            await $.wait(1000);
            await querySignReward(openId);
            
            await $.wait(1000);
            await queryAccountInfo();

            allUserNotice += notice;
            
        } catch (e) {
            $.log(`账号执行出错: ${e}`);
        }
    }
    if (allUserNotice) {
        await sendMsg(allUserNotice);
    }
}

async function userLogin(openId) {
    console.log("尝试登录...");
    const body = {
        "appId": "wx52872495fb375c4b",
        "openId": openId,
        "source": "JD"
    };
    const result = await commonPost('/memberCenterApiV2/member/findByOpenIdAppId', body);
    if (result && result.code === '000000') {
        token = result.info.token;
        userId = result.info.memberId;
        console.log("🎉 登录成功!");
        notice += "登录状态: 成功 ✅\n";
        return true;
    } else {
        const errorMsg = result ? result.msg : "请求失败";
        console.log(`⛔ 登录失败: ${errorMsg}`);
        notice += `登录状态: 失败, ${errorMsg} ❌\n`;
        return false;
    }
}

async function userSign(openId) {
    console.log("执行签到...");
    const body = {
        "userId": userId,
        "appId": "wx52872495fb375c4b",
        "openId": openId,
        "activId": "c0c4a0a3ef8145f49f2e294741a3cd62"
    };
    const result = await commonPost('/activCenterApi/signActivInfo/sign', body);
    if (result && result.code === '000000') {
        console.log(`🎉 签到成功: 获得 ${result.info[0].prizeSize} 积分`);
        notice += `每日签到: 成功, 获得 ${result.info[0].prizeSize} 积分\n`;
    } else {
        const errorMsg = result ? result.msg : "请求失败";
        console.log(`⛔ 签到失败: ${errorMsg}`);
        notice += `每日签到: ${errorMsg}\n`;
    }
}

async function querySignReward(openId) {
    console.log("查询累计签到天数...");
    const body = {
        "userId": userId,
        "appId": "wx52872495fb375c4b",
        "openId": openId,
        "activId": "d191dce0740849b1b7377e83c00475d6"
    };
    const result = await commonPost('/activCenterApi/signActivInfo/querySignDetail', body);
    if (result && result.code === '000000') {
        console.log(`🎉 当前累计签到 ${result.info.signDay} 天`);
        notice += `累计签到: ${result.info.signDay} 天\n`;
    } else {
        const errorMsg = result ? result.msg : "请求失败";
        console.log(`⛔ 查询累计签到失败: ${errorMsg}`);
        notice += `累计签到: 查询失败\n`;
    }
}

async function queryAccountInfo() {
    console.log("查询账户总积分...");
    const result = await commonPost('/memberCenterApiV2/golds/memberGoldsInfo', {});
    if (result && result.code === '000000') {
        console.log(`🎉 查询成功: 总积分 ${result.info.availableGoldsTotal}`);
        notice += `当前积分: ${result.info.availableGoldsTotal}\n`;
    } else {
        const errorMsg = result ? result.msg : "请求失败";
        console.log(`⛔ 查询积分失败: ${errorMsg}`);
        notice += `当前积分: 查询失败\n`;
    }
}

async function commonPost(url, body = {}) {
    let attempt = 0;
    while (attempt < maxRetries) {
        attempt++;
        const result = await new Promise(resolve => {
            const options = {
                url: `https://ump.ems.com.cn${url}`,
                headers: {
                    "Content-Type": 'application/json',
                    'MC-TOKEN': token, // 使用全局变量token
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.48(0x18003030) NetType/WIFI Language/zh_CN",
                },
                body: JSON.stringify(body)
            };
            $.post(options, async (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`请求错误: ${JSON.stringify(err)}`);
                        console.log(`${$.name} API请求失败，请检查网络`);
                    } else {
                        resolve(JSON.parse(data));
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve(null); // 确保在任何情况下都resolve
                }
            });
        });
        
        if (result) {
            return result;
        } else if (attempt < maxRetries) {
            console.log(`请求失败，正在进行第 ${attempt} 次重试...`);
            await $.wait(2000); // 等待2秒后重试
        }
    }
    return null; // 所有重试都失败后返回 null
}


async function getNotice() {
    try {
        const options = { url: `https://fastly.jsdelivr.net/gh/xzxxn777/Surge@main/Utils/Notice.json` };
        const resp = await $.get(options);
        if (resp.body) {
            console.log(JSON.parse(resp.body).notice);
        }
    } catch (e) {
        // 静默处理，获取公告失败不影响主流程
    }
}

async function sendMsg(message) {
    if (!message) return;
    if ($.isNode()) {
        await notify.sendNotify($.name, message);
    } else {
        $.msg($.name, '', message);
    }
}



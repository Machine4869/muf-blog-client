

const exec = require('child_process').exec
const execSync = require('child_process').execSync
var fs = require("fs")
const path = require('path');

export default{
  // 时间格式化
  dateFormat:function(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
  },
  // 同步执行
  runCMDSync: function(cmdStr) {
    execSync(cmdStr)
  },
  // 异步执行
  runCMD: function(cmdStr) {
    let workerProcess
      // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    // workerProcess = exec(cmdStr, {cwd: cmdPath})
    workerProcess = exec(cmdStr)
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
        // console.log('stdout: ' + data)
    })

    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
        // console.log('stderr: ' + data)
    })

    // 退出之后的输出
    workerProcess.on('close', function (code) {
        // console.log('out code：' + code)
    })
  }
}




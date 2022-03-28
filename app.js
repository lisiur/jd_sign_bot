// version v2.0.0
// create by ruicky
// detail url: https://github.com/ruicky/jd_sign_bot

import { execSync as exec, execFileSync } from "child_process";
import fs from "fs";
import download from "download";
import axios from "axios";

// 公共变量
const {
  KEY,
  DualKey,
  PUSH_ADDRESS,
} = process.env;

// 下载文件
async function downFile() {
  // const url = 'https://cdn.jsdelivr.net/gh/NobyDa/Script@master/JD-DailyBonus/JD_DailyBonus.js'
  const url =
    "https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js";
  await download(url, "./");
}

// 修改文件
async function changeFile() {
  let content = fs.readFileSync("./JD_DailyBonus.js", "utf8");
  content = content.replace(/var OtherKey = ``/, 'var OtherKey = `' + JSON.stringify([
      {
          cookie: KEY,
      }
  ]) + '`');
  fs.writeFileSync("./JD_DailyBonus.js", content, "utf8");
}

async function sendNotify() {
  const path = "./result.txt";
  let content = "";
  if (fs.existsSync(path)) {
    content = fs.readFileSync(path, "utf8");
  }
  await axios.post(PUSH_ADDRESS, {
    msg_type: "text",
    content: {
        text: content,
    },
  });
  // await send({
  //   title,
  //   text: content,
  //   method: PUSH_METHOD,
  //   key: PUSH_KEY || serverJ,
  //   secret: PUSH_SECRET,
  //   address: PUSH_ADDRESS,
  // });
  // await sendNotify(
  //   "" + ` ${res2} ` + ` ${res} ` + new Date().toLocaleDateString(),
  //   content
  // );
}

// 主程序
async function main() {
  if (!KEY) {
    console.log("请填写 key 后在继续");
    return;
  }
  // 下载最新代码
  await downFile();
  console.log("下载代码完毕");

  // 替换变量
  await changeFile();
  console.log("替换变量完毕");

  // 执行
  // execFileSync("JD_DailyBonus.js", [], {stdio: 'inherit})
  console.log(fs.readFileSync("JD_DailyBonus.js", "utf8"));
  exec("node JD_DailyBonus.js >> result.txt");
	require("./JD_DailyBonus.js")
  console.log("执行完毕");

  // 发送结果
  await sendNotify();
  console.log("发送完毕");
}

main();

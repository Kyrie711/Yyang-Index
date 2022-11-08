import { CommandType } from "@/core/command";
import axios from "axios";
import sha from "sha256";

/**
 * 翻译
 */

const tranCommand: CommandType = {
  func: "translate",
  name: "翻译",
  params: [
    {
      key: "word",
      desc: "要翻译的内容",
      required: true,
    },
  ],
  options: [
    {
      key: "from",
      desc: "源语言",
      alias: ["f"],
      type: "string",
      defaultValue: "auto",
    },
    {
      key: "to",
      desc: "目标语言",
      alias: ["t"],
      type: "string",
      defaultValue: "auto",
    },
  ],
  async action(options, terminal) {
    const { _, from, to } = options;
    if (_.length < 1) {
      terminal.writeTextErrorResult("参数不足");
      return;
    }
    const keywords = _.join(" ");
    const res: any = await new Promise((resolve, reject) => {
      const appKey = "69fa3c29556841d1";
      const key = "MVDw5qkvjbU1fgsygS9zzikr0yzAa1nl";
      const signType = "v3";
      const salt = new Date().getTime();
      const curtime = Math.round(new Date().getTime() / 1000);
      const q = keywords;
      let input = "";
      let len = q.length;
      if (len > 20) {
        input += q.substring(0, 10) + len + q.substring(len - 10, len);
      } else {
        input = q;
      }
      const sign = sha(appKey + input + salt + curtime + key);
      axios({
        url: "/backend/",
        method: "get",
        params: {
          q,
          from,
          to,
          appKey,
          salt,
          sign,
          signType,
          curtime,
        },
      }).then((res) => resolve(res));
    });
    if (res?.data.errorCode == "0") {
      terminal.writeTextSuccessResult(`翻译结果：${res.data.translation[0]}`);
    } else {
      terminal.writeTextErrorResult("翻译失败");
    }

    // const res: any = await new Promise((resolve, reject) => {
    //   const key = 'C1SmHN6rEjDqQ0g0fMfB'
    //   const appid = '20221107001440654'
    //   const salt = '1435660288'
    //   const q = keywords
    //   const sign = md5(appid+q+salt+key)
    //   axios({
    //     url: '/backend/',
    //     method: 'get',
    //     params: {
    //       q,
    //       from,
    //       to,
    //       appid,
    //       salt,
    //       sign
    //     }
    //   }).then(res => resolve(res))
    // })
    // if (res?.data.error_code) {
    //   console.log(res)
    //   terminal.writeTextErrorResult(res?.message ?? "翻译失败");
    // } else {
    //   terminal.writeTextSuccessResult(
    //     `翻译结果：${res.data.trans_result[0].dst}`
    //   );
    // }
  },
};

export default tranCommand;

import { CommandType } from '@/core/command'
import axios from 'axios'
import md5 from 'md5'


/**
 * 翻译
 */

const tranCommand: CommandType = {
  func: 'translate',
  name: '翻译',
  params: [
    {
      key: 'word',
      desc: '要翻译的内容',
      required: true
    }
  ],
  options: [
    {
      key: 'from',
      desc: '源语言',
      alias: ['f'],
      type: 'string',
      defaultValue: 'auto'
    },
    {
      key: 'to',
      desc: '目标语言',
      alias: ['t'],
      type: 'string',
      defaultValue: 'auto'
    }
  ],
  async action(options, terminal) {
    const { _, from, to } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足')
      return;
    }
    const keywords = _.join(' ')
    const res: any = await new Promise((resolve, reject) => {
      const key = 'C1SmHN6rEjDqQ0g0fMfB'
      const appid = '20221107001440654'
      const salt = '1435660288'
      const q = keywords
      const sign = md5(appid+q+salt+key)
      axios({
        url: 'base',
        method: 'get',
        params: {
          q,
          from,
          to,
          appid,
          salt,
          sign
        }
      }).then(res => resolve(res))
    })
    if (res?.error_code) {
      terminal.writeTextErrorResult(res?.message ?? "翻译失败");
    } else {
      terminal.writeTextSuccessResult(
        `翻译结果：${res.data.trans_result[0].dst}`
      );
    }
  }
}

export default tranCommand
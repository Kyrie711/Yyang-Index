/*
 * @Author: kkkkyrie
 * @Description: 切换终端背景
 */
import { CommandType } from '@/core/command'
import { useTerminalConfigStore } from '@/store/terminalConfig'
import axios from 'axios'

const backgroundCommand: CommandType = {
  func: "background",
  name: "切换终端背景",
  alias: ['bg'],
  params: [
    {
      key: "url",
      desc: "图片地址（不填则随机）",
      required: false
    }
  ],
  options: [],
  async action(options, terminal) {
    const { _ } = options
    let url = _[0]
    if (_.length > 0) {
      url = _[0]
    }
    const { setBackground } = useTerminalConfigStore()
    if (!url) {
      // 随机获取壁纸
      await axios.get('base')
      // console.log(res)
      // setBackground('https://api.mtyqx.cn/tapi/random.php')
    }
    setBackground(url)
  },
}

export default backgroundCommand
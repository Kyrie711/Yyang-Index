/*
 * @Author: kkkkyrie
 * @Description: 跳转命令
 */
import { CommandType } from '../command'

const gotoCommand: CommandType = {
  func: "goto",
  name: "网页跳转",
  alias: ["open", "visit", "jump"],
  params: [
    {
      key: "link",
      desc: "目标链接",
      required: true
    }
  ],
  options: [
    {
      key: "self",
      desc: "是否当前页面打开",
      alias: ['s'],
      type: "boolean",
      defaultValue: false
    }
  ],
  action(options, terminal) {
    const { _, self } = options
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足')
      return;
    }
    let link = _[0]
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      link = "http://" + link
    }
    if (self) {
      window.location.href = link
    } else {
      window.open(link)
    }
  },
}

export default gotoCommand
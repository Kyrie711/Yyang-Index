/*
 * @Author: kkkkyrie
 * @Description: 自定义终端欢迎语
 */
import { CommandType } from '@/core/command'
import { useTerminalConfigStore } from '@/store/terminalConfig'

const welcomeCommand: CommandType = {
  func: "welcome",
  name: '自定义终端欢迎语',
  params: [
    {
      key: "texts",
      desc: "终端提示文本（支持多个值 ，不填则无欢迎语）",
      required: false
    }
  ],
  options: [],
  action(options, terminal) {
    const {_} = options
    let welcomeTexts = _
    const { setWelcomeTexts } = useTerminalConfigStore()
    setWelcomeTexts(welcomeTexts)
    terminal.writeTextSuccessResult('欢迎语设置成功,请刷新页面')
  },
}

export default welcomeCommand

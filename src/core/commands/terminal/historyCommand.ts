/*
 * @Author: kkkkyrie
 * @Description: 查看历史命令
 */
import { CommandType } from '@/core/command'

const historyCommand: CommandType = {
  func: "history",
  name: "查看执行历史",
  alias: ['h'],
  options: [],
  collapsible: true,
  action(options, terminal) {
    const CommandOutputTypes = terminal.listCommandHistory()
    terminal.writeTextResult(`⭐️ 输入 ![序号] 可以快速执行某条历史命令`);
    CommandOutputTypes.forEach((command, index) => {
      terminal.writeTextResult(`${index + 1} ${command.text}`)
    })
  },
}

export default historyCommand
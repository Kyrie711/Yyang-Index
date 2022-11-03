import CommandInputType = YyangTerminal.CommandInputType
import CommandOutputType = YyangTerminal.CommandOutputType
import { ref, Ref } from 'vue'

/**
 * 查看历史功能
 * @param commandList
 * @param inputCommand
 */
const useHistory = (
  commandList: CommandOutputType[],
  inputCommand: Ref<CommandInputType>
) => {
  /**
   * 查看当前的命令位置
   */
  const commandHistoryPos = ref(commandList.length)

  const listCommandHistory = () => {
    return commandList
  }

  const showNextCommand = () => {
    if (commandHistoryPos.value < commandList.length - 1) {
      commandHistoryPos.value++
      inputCommand.value.text = commandList[commandHistoryPos.value].text
    } else if (commandHistoryPos.value === commandList.length - 1) {
      commandHistoryPos.value++
      inputCommand.value.text = ""
    }
  }

  const showPrevCommand = () => {
    if (commandHistoryPos.value >= 1) {
      commandHistoryPos.value--
      inputCommand.value.text = commandList[commandHistoryPos.value].text
    }
  }

  return {
    commandHistoryPos,
    listCommandHistory,
    showNextCommand,
    showPrevCommand
  }
}

export default useHistory
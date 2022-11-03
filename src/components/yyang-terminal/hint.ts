/*
 * @Author: kkkkyrie
 * @Description: 命令提示功能
 */
import { ref } from "vue";
import { commandMap } from "@/core/commandRegister";
import _, { trim } from "lodash";
import { useTerminalConfigStore } from "@/store/terminalConfig";
import { getUsageStr } from '@/core/commands/terminal/help/helpUtils'

const useHint = () => {
  const hint = ref("");
  const { showHint } = useTerminalConfigStore();

  const setHint = (inputText: string) => {
    // 未开启提示
    if (!showHint) {
      return;
    }
    if (!inputText) {
      hint.value = "";
      return;
    }
    const args = trim(inputText).split(" ");
    // 大小写无关
    let func = args[0].toLowerCase();
    // 前缀匹配
    const likeKey = Object.keys(commandMap).filter((key) => 
      key.startsWith(func)
    )[0];
    let command = commandMap[likeKey];
    if (!command) {
      hint.value = "";
      return;
    }
    hint.value = getUsageStr(command)
  };

  /**
   * 输入提示防抖
   */
  const debounceSetHint = _.debounce((inputText: string) => {
    setHint(inputText);
  }, 200);

  return {
    hint,
    setHint,
    debounceSetHint,
  };
};

export default useHint;

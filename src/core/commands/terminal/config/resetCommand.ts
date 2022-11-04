/*
 * @Author: kkkkyrie
 * @Description: 重置配置
 */
import { CommandType } from "@/core/command";
import { useTerminalConfigStore } from "@/store/terminalConfig";

const resetCommand: CommandType = {
  func: "reset",
  name: "重置终端配置",
  options: [],
  action(options, terminal) {
    const { reset } = useTerminalConfigStore();
    reset();
    terminal.writeTextSuccessResult("已重置终端配置");
  },
};

export default resetCommand;

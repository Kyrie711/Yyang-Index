/*
 * @Author: kkkkyrie
 * @Description: 清屏命令
 */
import { CommandType } from "@/core/command";

const clearCommand: CommandType = {
  func: "clear",
  name: "清屏",
  alias: ["cl"],
  options: [],
  action(options, terminal) {
    // 延时，把当前这条 clear 命令也清除
    setTimeout(() => {
      terminal.clear();
    }, 100);
  },
};

export default clearCommand;

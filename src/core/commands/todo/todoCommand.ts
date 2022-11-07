import { CommandType } from "@/core/command";
import { defineAsyncComponent, shallowRef } from "vue";
import ComponentOutputType = YyangTerminal.ComponentOutputType;
import addCommand from "./subCommands/addCommand";

const todoCommand: CommandType = {
  func: "todo",
  name: "待办事项",
  desc: "记录和管理事物",
  params: [
    {
      key: "subCommand",
      desc: "子命令",
      required: true,
    },
  ],
  options: [],
  subCommands: {
    add: addCommand,
  },
  collapsible: true,
  action(options, terminal) {
    const { _ } = options;
    if (_.length < 1) {
      const output: ComponentOutputType = {
        type: "component",
        component: shallowRef(
          defineAsyncComponent(() => import("./TodoBox.vue"))
        ),
      };
      terminal.writeResult(output);
      return;
    }
  },
};

export default todoCommand;

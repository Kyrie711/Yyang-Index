/*
 * @Author: kkkkyrie
 * @Description: 帮助命令
 */
import { CommandType } from "@/core/command";
import { defineAsyncComponent, shallowRef } from "vue";
import { commandMap } from "@/core/commandRegister";
import ComponentOutputType = YyangTerminal.ComponentOutputType;

const helpCommand: CommandType = {
  func: "help",
  name: "查看帮助",
  alias: [],
  params: [
    {
      key: "commandName",
      desc: "命令英文名称",
    },
  ],
  options: [],
  collapsible: true,
  action(options, terminal, parentCommand?) {
    const { _ } = options;
    // 输出所有帮助
    if (_.length < 1) {
      const output: ComponentOutputType = {
        type: "component",
        component: shallowRef(
          defineAsyncComponent(() => import("./HelpBox.vue"))
        ),
      };
      terminal.writeResult(output);
      return;
    }
    // 输出某个命令的帮助
    const commandName = _[0];
    let commands = commandMap;
    // 支持输出子命令的帮助
    if (
      parentCommand &&
      parentCommand.subCommands &&
      Object.keys(parentCommand.subCommands).length > 0
    ) {
      commands = parentCommand.subCommands;
    }
    const command = commands[commandName];
    if (!command) {
      terminal.writeTextErrorResult("找不到指定命令");
      return;
    }
    const output: ComponentOutputType = {
      type: "component",
      component: shallowRef(
        defineAsyncComponent(() => import("./CommandHelpBox.vue"))
      ),
      props: {
        command,
        parentCommand,
      },
    };
    terminal.writeResult(output);
  },
};

export default helpCommand;

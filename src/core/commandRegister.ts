import { CommandType } from "./command";
import dateCommand from "./commands/dateCommand";
import pingCommand from './commands/pingCommand'
import gotoCommand from './commands/gotoCommand'
import helpCommand from './commands/terminal/help/helpCommand'
import backgroundCommand from './commands/terminal/config/backgroundCommand'

/**
 * 命令列表（数组元素顺序会影响 help 命令的展示顺序）
 */

const commandList: CommandType[] = [
  dateCommand,
  pingCommand,
  gotoCommand,
  helpCommand,
  backgroundCommand
];

/**
 * 命令字典
 */

const commandMap: Record<string, CommandType> = {};

commandList.forEach((command) => {
  commandMap[command.func] = command;
  command.alias?.forEach((name) => {
    commandMap[name] = command;
  });
});

export { commandList, commandMap };

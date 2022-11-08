import { CommandType } from "./command";
import dateCommand from "./commands/dateCommand";
import pingCommand from './commands/pingCommand'
import gotoCommand from './commands/gotoCommand'
import helpCommand from './commands/terminal/help/helpCommand'
import backgroundCommand from './commands/terminal/config/backgroundCommand'
import hintCommand from './commands/terminal/config/hintCommand'
import resetCommand from './commands/terminal/config/resetCommand'
import welcomeCommand from './commands/terminal/config/welcomeCommand'
import clearCommand from './commands/terminal/clearCommand'
import historyCommand from './commands/terminal/historyCommand'
import shortcutCommand from './commands/terminal/shortcut/shortcutCommand'
import todoCommand from './commands/todo/todoCommand'
import tranCommand from './commands/tranCommand'
import baiduCommand from './commands/search/baiduCommand'
import googleCommand from './commands/search/googleCommand'
import bilibiliCommand from './commands/search/bilibiliCommand'
import githubCommand from './commands/search/githubCommand'
import zhihuCommand from './commands/search/zhihuCommand'

/**
 * 命令列表（数组元素顺序会影响 help 命令的展示顺序）
 */

const commandList: CommandType[] = [
  dateCommand,
  pingCommand,
  gotoCommand,
  helpCommand,
  backgroundCommand,
  hintCommand,
  resetCommand,
  welcomeCommand,
  clearCommand,
  historyCommand,
  shortcutCommand,
  todoCommand,
  tranCommand,
  baiduCommand,
  googleCommand,
  bilibiliCommand,
  githubCommand,
  zhihuCommand
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

import TerminalType = YyangTerminal.TerminalType;
import { commandMap } from "./commandRegister";
import { CommandType, CommandOptionType } from "./command";
import getopts, { Options, ParsedOptions } from "getopts";
import helpCommand from "./commands/terminal/help/helpCommand";

/**
 * 获取命令（匹配）
 * @param text
 *
 */
const getCommand = (text: string, parentCommand?: CommandType): CommandType => {
  let func = text.split(" ", 1)[0];
  // 大小写无关
  func = func.toLowerCase();
  let commands = commandMap;
  // 有父命令，则从父命令中查找
  if (
    parentCommand &&
    parentCommand.subCommands &&
    Object.keys(parentCommand.subCommands).length > 0
  ) {
    commands = parentCommand.subCommands;
  }
  const command = commands[func];
  console.log("commands", commands);
  return command;
};

/**
 * 解析参数
 * @param text
 * @param commandOptions
 */
const doParse = (
  text: string,
  commandOptions: CommandOptionType[]
): ParsedOptions => {
  // 过滤掉关键词
  const args: string[] = text.split(" ").slice(1);
  // 转换
  const options: Options = {
    alias: {},
    default: {},
    string: [],
    boolean: [],
  };
  commandOptions.forEach((commandOption) => {
    const { alias, key, type, defaultValue } = commandOption;
    if (alias && options.alias) {
      options.alias[key] = alias;
    }
    options[type]?.push(key);
    if (defaultValue && options.default) {
      options.default[key] = defaultValue;
    }
  });
  const parsedOptions = getopts(args, options);
  console.log("parsedOptions = ", parsedOptions);
  return parsedOptions;
};
/**
 * 执行
 * @param command
 * @param options
 * @param terminal
 *
 */
const doAction = async (
  command: CommandType,
  options: ParsedOptions,
  terminal: TerminalType,
  parentCommand?: CommandType
) => {
  const { help } = options;
  // 设置输出折叠
  if (command.collapsible || help) {
    terminal.setCommandCollapsible(true);
  }
  // 查看帮助
  // e.g. xxx --help => { _: ["xxx"] }
  // 转成参数的形式
  if (help) {
    const newOptions = { ...options, _: [command.func] };
    helpCommand.action(newOptions, terminal, parentCommand);
    return;
  }
  await command.action(options, terminal);
};

export const doCommandExecute = async (
  text: string,
  terminal: TerminalType,
  parentCommand?: CommandType
) => {
  //去除命令首尾空格
  text = text.trim();
  if (!text) {
    return;
  }
  // 解析文本，得到命令
  const command: CommandType = getCommand(text, parentCommand);
  if (!command) {
    terminal.writeTextErrorResult("找不到命令");
    return;
  }
  // 解析参数（需传递不同的解析规则）
  const parsedOptions = doParse(text, command.options);
  const { _ } = parsedOptions;
  // 有子命令，执行
  if (
    _.length > 0 &&
    command.subCommands &&
    Object.keys(command.subCommands).length > 0
  ) {
    // 把子命令当做新命令解析，todo add xxx => add xxx
    const subText = text.substring(text.indexOf(" ") + 1);
    await doCommandExecute(subText, terminal, command);
    return;
  }

  // 执行命令
  await doAction(command, parsedOptions, terminal, parentCommand);
};

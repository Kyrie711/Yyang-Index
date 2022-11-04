<script setup lang="ts">
import { computed, StyleValue, ref, onMounted, watchEffect } from "vue";
import { useTerminalConfigStore } from "../../store/terminalConfig";
import OutputType = YyangTerminal.OutputType;
import CommandOutputType = YyangTerminal.CommandOutputType;
import CommandInputType = YyangTerminal.CommandInputType;
import TerminalType = YyangTerminal.TerminalType;
import OutputStatusType = YyangTerminal.OutputStatusType;
import TextOutputType = YyangTerminal.TextOutputType;
import useHint from './hint'
import useHistory from './history'
import { registerShortcuts } from './shortcuts'

const user = ref("[local]$");
/**
 * 终端背景样式
 */
const wrapperStyle = computed(() => {
  const { background } = configStore;
  const style: StyleValue = {};
  if (background.startsWith("http")) {
    style.background = `url(${background})`;
  } else {
    style.background = background;
  }
  return style;
});

interface YyangTerminalProps {
  onSubmitCommand?: (inputText: string) => void;
}

const props = defineProps<YyangTerminalProps>();

const terminalRef = ref();
const activeKeys = ref<number[]>([]);

// 输出列表
const outputList = ref<OutputType[]>([]);
// 命令列表
const commandList = ref<CommandOutputType[]>([]);

const commandInputRef = ref();

// 命令是否运行
const isRunning = ref<boolean>(false);

// 引入终端配置状态
const configStore = useTerminalConfigStore();

/**
 * 初始命令
 */
const initcommand: CommandInputType = {
  text: "",
};

/**
 * 待输入的命令
 */
const inputcommand = ref<CommandInputType>({
  ...initcommand,
});

/**
 * 全局记录当前命令，便于写入结果
 */
let currentNewCommand: CommandOutputType;

const { 
  commandHistoryPos, 
  showNextCommand,
  showPrevCommand,
  listCommandHistory
} = useHistory(commandList.value, inputcommand)

const { hint, setHint, debounceSetHint } = useHint()

/**
 * 提交命令（回车）
 */
const doSubmitCommand = async () => {
  isRunning.value = true;
  // 清除提示
  setHint("")
  let inputText = inputcommand.value.text;
  console.log("inputText", inputText);
  // 执行某条历史记录
  if (inputText.startsWith("!")) {
    const commandIndex = Number(inputText.substring(1))
    const command = commandList.value[commandIndex - 1]
    if (command) {
      inputText = command.text
    }
  }

  // 记录当前命令
  const newCommand: CommandOutputType = {
    text: inputText,
    type: "command",
    resultList: [],
  };
  currentNewCommand = newCommand;

  // 执行命令
  await props.onSubmitCommand?.(inputText);
  // 添加输出（为空也要输出换行）
  outputList.value.push(newCommand);

  // 不为空字符串才算是有效命令
  if (inputText) {
    commandList.value.push(newCommand);
    // 重置当前要查看的命令位置
    commandHistoryPos.value = commandList.value.length
  }
  inputcommand.value = { ...initcommand };
  // 默认展开折叠面板
  activeKeys.value.push(outputList.value.length - 1);
  // 自动滚到底部
  setTimeout(() => {
    terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
  }, 50);
  isRunning.value = false;
};

// 输入框内容改变时，触发输入提示
watchEffect(() => {
  debounceSetHint(inputcommand.value.text)
})

/**
 * 清空所有输出
 */
const clear = () => {
  outputList.value = [];
};

/**
 * 写命令文本结果
 * @param text
 * @param status
 */
const writeTextResult = (text: string, status?: OutputStatusType) => {
  const newOutput: TextOutputType = {
    text,
    type: "text",
    status,
  };
  currentNewCommand.resultList.push(newOutput);
};

/**
 * 写文本错误状态结果
 * @param text
 */
const writeTextErrorResult = (text: string) => {
  writeTextResult(text, "error");
};

/**
 * 写文本成功状态结果
 * @param text
 */
const writeTextSuccessResult = (text: string) => {
  writeTextResult(text, "success");
};

/**
 * 写结果
 * @param output
 */
const writeResult = (output: OutputType) => {
  currentNewCommand.resultList.push(output);
};
/**
 * 立即输出文本
 * @param text
 * @param status
 */
const writeTextOutput = (text: string, status?: OutputStatusType) => {
  const newOutput: TextOutputType = {
    text,
    type: "text",
    status,
  };
  outputList.value.push(newOutput);
};

/**
 * 设置命令是否可折叠
 * @param collapsible
 */
const setCommandCollapsible = (collapsible: boolean) => {
  currentNewCommand.collapsible = collapsible;
};

/**
 * 立即输出
 * @param newOutput
 */
// const writeOutput = (newOutput: OutputType) => {
//   outputList.value.push(newOutput);
// };

/**
 * 输入框聚焦
 */
const focusInput = () => {
  commandInputRef.value.focus();
};
/**
 * 获取输入框是否聚焦
 */
const isInputFocused = () => {
  return (
    (commandInputRef.value.input as HTMLInputElement) == document.activeElement
  );
};
/**
 *  设置输入框的值 
 */
const setTabCompletion = () => {
  if (hint.value) {
    inputcommand.value.text = `${hint.value.split(" ")[0]}${
      hint.value.split(" ").length > 1 ? " " : ""
    }`
  }
}
/**
 * 折叠 / 展开所有块
 */
const toggleAllCollapse = () => {
  // 展开
  if (activeKeys.value.length === 0) {
    activeKeys.value = outputList.value.map((_, index) => {
      return index;
    });
  } else {
    // 折叠
    activeKeys.value = [];
  }
};
/**
 * 操作终端的对象
 */
const terminal: TerminalType = {
  writeTextResult,
  writeTextErrorResult,
  writeTextSuccessResult,
  writeResult,
  writeTextOutput,
  // writeOutput,
  setTabCompletion,
  clear,
  focusInput,
  isInputFocused,
  doSubmitCommand,
  listCommandHistory,
  showNextCommand,
  showPrevCommand,
  toggleAllCollapse,
  setCommandCollapsible,
};

onMounted(() => {
  registerShortcuts(terminal)
  const { welcomeTexts } = configStore;
  if (welcomeTexts?.length > 0) {
    welcomeTexts.forEach((welcomeText) => {
      terminal.writeTextOutput(welcomeText);
    });
  } else {
    terminal.writeTextOutput(
      `Welcome to YyangIndex! ` + 
        `<a href="//github.com/Kyrie711/Yyang-Index" target='_blank' >GitHub Open Source</a>`
    );
    terminal.writeTextOutput(
      `please input 'help' to enjoy!`
    )
    terminal.writeTextOutput(`<br/>`);
  }
});

/**
 * 当点击空白聚焦输入框
 */
const handleClickWrapper = (e: Event): void => {
  
  // console.log(e.target)
  //@ts-ignore
  // console.log(e.currentTarget?.style)
  //@ts-ignore
  if (e.target?.className === "yyang-terminal") {
    focusInput();
  }
};

defineExpose({
  terminal,
});
</script>

<template>
  <div class="yyang-terminal-wrapper" :style="wrapperStyle" @click="handleClickWrapper">
    <div ref="terminalRef" class="yyang-terminal">
      <a-collapse
        v-model:active-key="activeKeys"
        :bordered="false"
        expand-icon-position="right"
      >
        <template v-for="(output, index) in outputList" :key="index">
          <!-- 折叠 -->
          <a-collapse-panel
            v-if="output.collapsible"
            :key="index"
            class="terminal-row"
          >
            <template #header>
              <span style="user-select: none; margin-right: 10px">
                {{ user }}
              </span>
              <span>{{ output.text }}</span>
            </template>
            <div
              v-for="(result, idx) in output.resultList"
              :key="idx"
              class="terminal-row"
            >
              <content-output :output="result" />
            </div>
          </a-collapse-panel>
          <!-- 不折叠 -->
          <template v-else>
            <!-- 输出命令及结果 -->
            <template v-if="output.type === 'command'">
              <div class="terminal-row">
                <span style="user-select: none; margin-right: 10px">
                  {{ user }}
                </span>
                <span>{{ output.text }}</span>
              </div>
              <div
                v-for="(result, idx) in output?.resultList"
                :key="idx"
                class="terminal-row"
              >
                <content-output :output="result" />
              </div>
            </template>
            <!-- 打印信息 -->
            <template v-else>
              <div class="terminal-row">
                <content-output :output="output" />
              </div>
            </template>
          </template>
        </template>
      </a-collapse>

      <div class="terminal-row">
        <a-input
          ref="commandInputRef"
          v-model:value="inputcommand.text"
          class="command-input"
          :disabled="isRunning"
          :bordered="false"
          autofocus
          @press-enter="doSubmitCommand"
        >
          <template #addonBefore>
            <span class="command-input-prompt"> [local]$ </span>
          </template>
        </a-input>
        <!-- 输入提示 -->
        <div v-if="hint && !isRunning" class="terminal-row" style="color: #bbb;">
          hint: {{hint}}
        </div>
          
        <div style="margin-bottom: 16px" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.yyang-terminal-wrapper {
  background: black;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.yyang-terminal {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
}

.yyang-terminal::-webkit-scrollbar {
  display: none;
}

.yyang-terminal span {
  font-size: 16px;
}

.yyang-terminal
  :deep(.ant-collapse-icon-position-right
    > .ant-collapse-item
    > .ant-collapse-header) {
  color: white;
  padding: 0;
}

.yyang-terminal :deep(.ant-collapse) {
  background: none;
}

.yyang-terminal :deep(.ant-collapse-borderless > .ant-collapse-item) {
  border: none;
}

.yyang-terminal :deep(.ant-collapse-content > .ant-collapse-content-box) {
  padding: 0;
}

.command-input {
  caret-color: white;
}

.command-input :deep(input) {
  color: white !important;
  font-size: 16px;
  padding: 0 10px;
}

.command-input :deep(.ant-input-group-addon) {
  background: none;
  border: none;
  padding: 0;
}

.command-input-prompt {
  color: white;
  background: transparent;
}

.terminal-row {
  color: white;
  font-size: 16px;
  font-family: courier-new, courier, monospace;
}
</style>

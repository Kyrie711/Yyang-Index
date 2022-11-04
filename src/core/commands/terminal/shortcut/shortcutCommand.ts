/*
 * @Author: kkkkyrie
 * @Description: 快捷键命令
 */
import { CommandType } from '@/core/command'
import { defineAsyncComponent, shallowRef } from 'vue'
import ComponentOutputType = YyangTerminal.ComponentOutputType  

const shortcutCommand: CommandType = {
  func: "shortcut",
  name: "快捷键",
  desc: "查看快捷键",
  options: [],
  collapsible: true,
  action(options, terminal) {
    const output: ComponentOutputType = {
      type: 'component',
      component: shallowRef(defineAsyncComponent(() => import('./ShortBox.vue')))
    }
    terminal.writeResult(output)
  },
}

export default shortcutCommand
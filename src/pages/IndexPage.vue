<script setup lang="ts">
import { doCommandExecute } from "@/core/commandExecutor";
import { ref } from "vue";
const terminalRef = ref();

const onSubmitCommand = async (inputText: string) => {
  if (!inputText) {
    return;
  }
  const terminal = terminalRef.value.terminal;
  await doCommandExecute(inputText, terminal);
};
</script>

<template>
  <YyangTerminal ref="terminalRef" :on-submit-command="onSubmitCommand" />
</template>

<style scoped></style>

<script setup lang="ts">
import smartText from "@/utils/smartText";
import OutputType = YyangTerminal.OutputType;
import { toRefs, computed } from "vue";

interface OutputProps {
  output: OutputType;
}

const props = defineProps<OutputProps>();
const { output } = toRefs(props);
const outputTagColor = computed((): string => {
  if (!output.value.status) {
    return "";
  }
  switch (output.value.status) {
    case "info":
      return "dodgerblue";
    case "success":
      return "limegreen";
    case "warning":
      return "darkorange";
    case "error":
      return "#c0300f";
    case "system":
      return "#bfc4c9";
    default:
      return "";
  }
});
</script>

<template>
  <div class="content-output">
    <template v-if="output.type === 'text'">
      <ATag v-if="outputTagColor" :color="outputTagColor">
        {{ output.status }}
      </ATag>
      <span v-html="smartText(output.text)"></span>
    </template>
    <component
      :is="output.component"
      v-if="output.type === 'component'"
      v-bind="output.props ?? {}"
    ></component>
  </div>
</template>

<style scoped>
.content-output :deep(.ant-tag) {
  border-radius: 0;
  font-size: 16px;
  border: none;
}
</style>

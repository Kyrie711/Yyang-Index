<script setup lang="ts">
  import { shortcutList } from '@/components/yyang-terminal/shortcuts'
</script>

<template>
  <div>
    <div>快捷键：</div>
    <div v-for="(shortcut, index) in shortcutList" :key="index">
      <a-row v-if="shortcut.desc" :gutter="16">
        <a-col :span="4">{{shortcut.keyDesc ?? shortcut.code}}</a-col>
        <a-col :span="4">{{shortcut.desc}}</a-col>
      </a-row>
    </div>
  </div>
</template>

<style scoped>

</style>
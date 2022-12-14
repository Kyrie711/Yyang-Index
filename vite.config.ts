import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-ignore
import Components from "unplugin-vue-components/vite";
// @ts-ignore
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 按需加载 ant-design-vue
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  // server: {
  //   proxy: {
  //     '/base': {
  //       target: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
  //       changeOrigin: true,
  //       secure: true,
  //       rewrite(path) {
  //         return path.replace(/^\/base/, '')
  //       },
  //     }
  //   }
  // }
});

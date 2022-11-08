import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path, { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

//自动导入element plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // server:{
  //   proxy:{
  //     // '/server': 'http://127.0.0.1:3000',
  //     '/server': {
  //       target: 'http://127.0.0.1:3000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/server/, '')
  //     },
  //   },
  // },
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
  base:'./'
})

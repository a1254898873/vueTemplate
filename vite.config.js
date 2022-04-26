import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImport from 'vite-plugin-babel-import';
import path from 'path'

const baseUrl = {
  development: './',
  beta: './',
  release: './'
}

// https://vitejs.dev/config/
export default ({ mode }) =>  defineConfig({
  plugins: [
    vue()
  ],
  base: baseUrl[mode],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 用于解决跨域问题
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8090',
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
})

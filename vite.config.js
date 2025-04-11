import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
//这里很危险 请不要在生产环境中使用
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 允许所有 IP 访问
    port: 5173, // 指定端口号
    strictPort: true, // 如果端口被占用，直接退出
    open: true, // 启动时自动打开浏览器
  },
})



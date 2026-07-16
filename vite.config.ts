import { defineConfig } from 'vite';

// 算法图谱 —— 纯前端静态站，无需后端代理。
// 构建产物为可双击打开的静态文件（部署到任意静态托管）。
export default defineConfig({
  // 相对路径，便于子目录部署 / 本地直接打开
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
    // 每个 algorithm 是独立动态 import 的 chunk；放宽单包告警阈值
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // viz 原语 / 播放器 / shell 拆成共享 chunk，避免每个算法都内联一份
        manualChunks(id) {
          if (id.includes('/viz/') || id.includes('/trace/')) return 'viz';
          if (id.includes('/core/') || id.includes('/shell/')) return 'shell';
          if (id.includes('/node_modules/')) return 'vendor';
          return undefined;
        },
      },
    },
  },
  server: {
    port: 5200,
    open: true,
  },
});

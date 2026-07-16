// 半同步半异步（Half-Sync/Half-Async）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-half-sync-half-async',
  categoryId: 'design',
  title: { zh: '半同步半异步', en: 'Half-Sync/Half-Async' },
  summary: { zh: '异步层与同步层解耦。', en: 'Decouple async and sync layers.' },
  description: {
    zh: '半同步半异步模式用异步层快速接收 IO，放入队列后由同步工作线程处理，兼顾响应性与简洁性，常见于服务器。',
    en: 'Half-Sync/Half-Async uses an async layer to receive I/O quickly and a queue feeding sync worker threads; balances responsiveness and simplicity in servers.',
  },
  tags: ['design', 'pattern', 'half-sync', 'concurrency'],
  complexity: { time: 'O(n)', space: 'O(q)' },
};

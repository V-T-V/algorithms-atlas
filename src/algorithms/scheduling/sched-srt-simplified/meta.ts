// 简化最短剩余 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-srt-simplified',
  categoryId: 'scheduling',
  title: { zh: '简化最短剩余', en: 'Simplified Shortest Remaining' },
  summary: {
    zh: '每进程执行完才切换的简化版。',
    en: 'Simplified version that switches only on completion.',
  },
  description: { zh: '非抢占，选剩余最短。', en: 'Non-preemptive, min remaining. O(n^2).' },
  tags: ['scheduling', 'srt'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};

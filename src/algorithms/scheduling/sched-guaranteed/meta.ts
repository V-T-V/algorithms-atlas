// 公平分享调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-guaranteed',
  categoryId: 'scheduling',
  title: { zh: '公平分享调度', en: 'Fair Share Scheduling' },
  summary: {
    zh: '按用户/组均分 CPU 时间。',
    en: 'Distribute CPU time fairly across users/groups.',
  },
  description: {
    zh: '按组计算份额，组内轮流。',
    en: 'Per-group share, round-robin within. O(n log n).',
  },
  tags: ['scheduling', 'fair-share'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

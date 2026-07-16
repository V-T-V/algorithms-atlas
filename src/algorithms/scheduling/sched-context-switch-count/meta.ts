// 上下文切换计数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-context-switch-count',
  categoryId: 'scheduling',
  title: { zh: '上下文切换计数', en: 'Context Switch Count' },
  summary: {
    zh: '统计调度段中的上下文切换次数。',
    en: 'Count context switches in schedule segments.',
  },
  description: { zh: '相邻段 id 不同即一次切换。', en: 'Adjacent different id => 1 switch. O(n).' },
  tags: ['scheduling', 'metric'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

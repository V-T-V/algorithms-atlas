// SJF抢占变体 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-sjf-preempt',
  categoryId: 'scheduling',
  title: { zh: 'SJF抢占变体', en: 'Preemptive SJF Variant' },
  summary: {
    zh: '新进程到达且 burst 更短时抢占。',
    en: 'Preempt when new arrival has shorter burst.',
  },
  description: {
    zh: '比较新到达进程与当前剩余。',
    en: 'Compare new arrival with current. O(n^2).',
  },
  tags: ['scheduling', 'preemptive'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};

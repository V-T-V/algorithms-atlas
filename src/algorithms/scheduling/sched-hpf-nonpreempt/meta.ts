// 最高优先级先服务 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-hpf-nonpreempt',
  categoryId: 'scheduling',
  title: { zh: '最高优先级先服务', en: 'Highest Priority First' },
  summary: {
    zh: '非抢占选最高优先级，同优先级 FCFS。',
    en: 'Non-preemptive, highest priority, FCFS tie.',
  },
  description: { zh: '就绪选最高优先级。', en: 'Pick highest priority from ready. O(n^2).' },
  tags: ['scheduling', 'priority'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};

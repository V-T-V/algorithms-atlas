// 最大表现 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-max-performance',
  categoryId: 'greedy',
  title: { zh: '最大表现（团队表现）', en: 'Maximum Team Performance' },
  summary: {
    zh: '选最多 k 名工程师，最大化 min(效率) × sum(速度)，用堆维护。',
    en: 'Choose at most k engineers to maximize min(efficiency) × sum(speed), maintained with a heap.',
  },
  description: {
    zh: '按效率降序遍历，用最小堆保留当前速度最大的至多 k 人，累加速度并以当前效率为最小值评估。',
    en: 'Iterate by efficiency descending; keep the top-k speeds in a min-heap; accumulate speed and evaluate with the current efficiency as the minimum.',
  },
  tags: ['greedy', 'heap'],
  complexity: { time: 'O(n log n)', space: 'O(k)' },
};

// 无重叠区间 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-non-overlapping',
  categoryId: 'greedy',
  title: { zh: '无重叠区间（最少删除）', en: 'Non-overlapping Intervals' },
  summary: {
    zh: '删除最少数量区间使剩余互不重叠。',
    en: 'Remove the minimum intervals so the rest are non-overlapping.',
  },
  description: {
    zh: '按右端点排序贪心：能选就选，更新右界；否则计数删除。',
    en: 'Sort by right endpoint greedily: keep it if it fits, update the boundary; otherwise count a removal.',
  },
  tags: ['greedy', 'interval'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

// 最大单元数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-max-units',
  categoryId: 'greedy',
  title: { zh: '最大单元数', en: 'Maximum Units on a Truck' },
  summary: {
    zh: '卡车容量有限，每类箱子含不同单元数，贪心选单元数最大的箱子。',
    en: 'Limited truck slots; box types carry different units; greedily pick highest-unit boxes.',
  },
  description: {
    zh: '按每箱单元数降序排序，尽可能多地取该类箱子直到装满。',
    en: 'Sort box types by units per box descending; take as many as possible until the truck is full.',
  },
  tags: ['greedy'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

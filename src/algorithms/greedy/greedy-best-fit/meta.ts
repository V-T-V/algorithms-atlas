// 最佳适应装箱（Best Fit Bin Packing）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-best-fit',
  categoryId: 'greedy',
  title: { zh: '最佳适应装箱', en: 'Best Fit Bin Packing' },
  summary: {
    zh: '每个物品放入剩余空间最小但能容纳的箱子，减少碎片。',
    en: 'Place each item in the bin with the least leftover room that still fits; reduces fragmentation.',
  },
  description: {
    zh: '最佳适应：扫描所有箱子，选能容纳且剩余最小的。与首次适应同阶 11/9·OPT。',
    en: 'Best fit: scan all bins, pick the tightest that fits. Same order 11/9·OPT as first fit.',
  },
  tags: ['greedy', 'bin-packing', 'approximation'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};

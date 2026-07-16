// Natural Merge Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'merge-sort-natural',
  categoryId: 'sorting',
  title: { zh: '自然归并排序', en: 'Natural Merge Sort' },
  summary: {
    zh: '利用输入中已有的有序段（run），逐轮两两归并直至整体有序。',
    en: 'Exploits existing ordered runs in the input, merging them pairwise until sorted.',
  },
  description: {
    zh: '自然归并排序（Natural Merge Sort）是自底向上归并的变体：它不机械地按 2 的幂划分块，而是先扫描出输入中所有「天然有序段」（非降序的极大连续子段），然后逐轮把相邻两段归并成更长的有序段，直到只剩一段。\n\n对于已基本有序的输入，初始 run 数很少，归并轮数大幅减少，接近 O(n)；最坏情况（完全逆序，每个元素自成一段）退化为 O(n log n)。需要 O(n) 辅助空间。稳定。',
    en: 'Natural Merge Sort is a bottom-up merge variant: instead of mechanically partitioning into power-of-two blocks, it first scans the input for naturally ordered runs (maximal non-decreasing contiguous sub-arrays), then merges adjacent runs pairwise each round until only one remains.\n\nOn nearly-sorted input the initial run count is tiny, so the number of merge rounds drops sharply — approaching O(n). Worst case (fully reversed, every element its own run) degrades to O(n log n). Needs O(n) auxiliary space. Stable.',
  },
  tags: ['sorting', 'stable', 'divide-and-conquer', 'merge', 'adaptive'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  attributes: { stable: 'true', best: 'O(n)' },
};

// 珠排序变种（Bead Sort 变种）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-gravity-bead',
  categoryId: 'sorting',
  title: { zh: '珠排序变种（计数实现）', en: 'Bead Sort (Counting Variant)' },
  summary: {
    zh: '用每列珠子数等于该值的高度，让珠子受「重力」下落，再按每行珠子数读出排序结果。',
    en: 'Represent numbers as columns of beads; let gravity pull beads down, then read row counts to obtain sorted order.',
  },
  description: {
    zh: '珠排序（Bead Sort）是一种非比较排序。把每个正整数视作一列该高度的珠子；当珠子受重力下落后，每行拥有的珠子数即构成非递减序列。本实现采用计数矩阵方式：构造 rows=max × cols=n 的网格，按列填珠，再逐行求和得到结果。仅适用于非负整数。',
    en: 'Bead Sort is a non-comparison sort. Treat each positive integer as a column of beads of that height; after gravity acts, the number of beads in each row forms a non-decreasing sequence. This implementation uses a counting matrix: a max×n grid filled per column, summed per row to read the result. Works only for non-negative integers.',
  },
  tags: ['sorting', 'non-comparison', 'distribution'],
  complexity: { time: 'O(n·m)', space: 'O(n·m)' },
};

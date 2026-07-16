// 闪排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'flash-sort',
  categoryId: 'sorting',
  title: { zh: '闪排序', en: 'Flash Sort' },
  summary: {
    zh: '按值域分桶后用置换循环就地归位，无需桶数组的分布排序。',
    en: 'Distribution sort that bins by value range then permutes in place.',
  },
  description: {
    zh:
      '闪排序（Flash Sort）由 Karl-Dietrich Neubert 于 1998 年提出，是桶排序的就地变种。' +
      '\n- 把 `[min, max]` 划分为 `m ≈ 0.42n` 个等宽桶，每个元素按线性映射落到某个桶。' +
      '\n- 先计数得每桶边界（前缀和），形成「桶边界数组」。' +
      '\n- 再用置换循环把每个元素送到它所属桶的区间内（桶内未必有序）。' +
      '\n- 最后对每个小桶做插入排序收尾。' +
      '\n平均 `O(n)`，最坏 `O(n²)`（当数据高度集中时）；空间 `O(m)`；原地、不稳定。',
    en:
      'Flash Sort, proposed by Karl-Dietrich Neubert in 1998, is an in-place variant of bucket sort. ' +
      '\n- Split [min, max] into m ≈ 0.42n equal-width classes; each element maps linearly into one. ' +
      '\n- Count to form class boundaries via prefix sums. ' +
      '\n- Use permutation cycles to route every element into its class range (not yet sorted within). ' +
      '\n- Finish with insertion sort on each small class. ' +
      'Average O(n), worst O(n²) when data is highly skewed; space O(m); in-place, unstable.',
  },
  tags: ['sorting', 'distribution', 'in-place', 'unstable'],
  complexity: { time: 'O(n)', space: 'O(m)' },
};

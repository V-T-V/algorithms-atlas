// 重力排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gravity-sort',
  categoryId: 'sorting',
  title: { zh: '重力排序', en: 'Gravity Sort' },
  summary: {
    zh: '用模拟「珠子受重力下落」的位矩阵对非负整数排序。',
    en: 'Sort non-negative integers by simulating beads falling under gravity in a bit matrix.',
  },
  description: {
    zh:
      '重力排序（Gravity Sort，又称 Bead Sort 的矩阵实现）：' +
      '\n- 把每个待排序数 v 想象成一排 v 颗「珠子」。' +
      '\n- 构造一个 (n × max) 的位矩阵：第 i 行前 v_i 列为 1，其余为 0。' +
      '\n- 「重力下落」= 对每列求和，再按各行的列累加重排——等价于对每列计数后重建。' +
      '\n- 结果是升序（或反转为降序）。' +
      '\n时间 `O(n·max)`，空间 `O(n·max)`；仅适用于**非负整数**；稳定。',
    en:
      'Gravity Sort (the matrix form of Bead Sort): ' +
      '\n- Imagine each value v as a row of v beads. ' +
      '\n- Build an (n × max) bit matrix where row i has v_i leading 1s. ' +
      '\n- "Gravity" = sum each column, then rebuild rows from the per-column counts. ' +
      '\n- Result is ascending (reverse for descending). ' +
      'Time O(n·max), space O(n·max); non-negative integers only; stable.',
  },
  tags: ['sorting', 'distribution', 'simulation', 'non-negative-integer', 'stable'],
  complexity: { time: 'O(n·m)', space: 'O(n·m)' },
};

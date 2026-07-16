// 二维峰值查找 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-peak-2d',
  categoryId: 'searching',
  title: { zh: '二维峰值查找', en: '2D Peak Find' },
  summary: {
    zh: '在矩阵中用列二分 + 行最大找二维峰值，O(n log m)。',
    en: 'Find a 2D peak via column binary search + row-max, in O(n log m).',
  },
  description: {
    zh:
      '二维峰值查找（2D Peak Find）：矩阵中一个元素是峰值，当且仅当它 ≥ 上下左右四个邻居。' +
      '\n分治算法（O(n log m)，n 行 m 列）：' +
      '\n- 取中间列 j = m/2，找到该列的最大值所在行 i（a[i][j]）。' +
      '\n- 比较 a[i][j] 与左右邻居 a[i][j−1]、a[i][j+1]：' +
      '\n  · 若左邻居更大，则在左半子矩阵 [.., j−1] 递归；' +
      '\n  · 若右邻居更大，则在右半 [j+1, ..] 递归；' +
      '\n  · 否则 a[i][j] 即为峰值。' +
      '\n正确性：列最大值若非峰值，则较大邻居所在半边必存在峰值（由单调传递）。',
    en:
      '2D Peak Find: a matrix cell is a peak iff it is ≥ its four orthogonal neighbors. ' +
      '\nDivide & conquer in O(n log m) (n rows, m cols): ' +
      '\n- Take the middle column j = m/2, find the row i of its maximum (a[i][j]). ' +
      '\n- Compare a[i][j] with left/right neighbors a[i][j−1], a[i][j+1]: ' +
      '\n  · if the left is larger, recurse on the left half [.., j−1]; ' +
      '\n  · if the right is larger, recurse on the right half [j+1, ..]; ' +
      '\n  · else a[i][j] is a peak. ' +
      'Correctness: a column-max, if not a peak, has a larger neighbor in whose half a peak must exist.',
  },
  tags: ['searching', '2d', 'divide-and-conquer', 'peak'],
  complexity: { time: 'O(n log m)', space: 'O(log m)' },
};

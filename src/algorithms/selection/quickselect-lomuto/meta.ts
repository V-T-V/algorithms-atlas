// 快速选择（Lomuto 分区）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quickselect-lomuto',
  categoryId: 'selection',
  title: { zh: '快速选择（Lomuto）', en: 'Quickselect (Lomuto)' },
  summary: {
    zh: '用 Lomuto 分区在 O(n) 期望时间内找数组第 k 小元素。',
    en: 'Find the k-th smallest element in expected O(n) via Lomuto partitioning.',
  },
  description: {
    zh: '快速选择是快速排序的「半成品」版：每轮选一个基准做 Lomuto 分区，只递归包含目标 k 的那一侧。\n\n- 取最右元素为基准\n- 分区后基准落在最终位置 p\n- 若 p === k 则找到；若 k < p 递归左段；否则递归右段\n\n期望 O(n)，最坏 O(n²)（已序输入）。',
    en: 'Quickselect is "half" of quicksort: partition around a pivot, then recurse only into the side containing k.\n\n- Pick rightmost as pivot (Lomuto)\n- After partition pivot sits at final index p\n- If p === k, done; if k < p recurse left; else recurse right\n\nExpected O(n), worst O(n²) on sorted input.',
  },
  tags: ['divide-and-conquer', 'in-place', 'order-statistics'],
  complexity: { time: 'O(n) 期望', space: 'O(log n)' },
};

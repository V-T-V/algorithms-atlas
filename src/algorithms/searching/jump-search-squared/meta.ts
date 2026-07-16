// 平方跳跃搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jump-search-squared',
  categoryId: 'searching',
  title: { zh: '平方跳跃搜索', en: 'Jump Search (Squared)' },
  summary: {
    zh: '用 ⌊√n⌋ 步长跳跃后线性回扫，最优块大小 √n。',
    en: 'Jump by ⌊√n⌋ then linear-scan back; the optimal block size is √n.',
  },
  description: {
    zh:
      '平方跳跃搜索（Jump Search · Squared）：在升序数组中以 `step = ⌊√n⌋` 为步长向右跳跃，' +
      '直到 `a[min(pos,n)-1] ≥ target` 或越界，再在定位到的块 `[prev, min(pos,n))` 内线性回扫。' +
      '\n- 步长取 √n 是「跳跃次数 × 块内比较次数」之和的最优解（minimize √n + √n）。' +
      '\n- 总比较次数固定为 `O(√n)`，比二分在「读取代价高、可顺序预取」的存储上更友好。',
    en:
      'Jump Search (Squared): in an ascending array, jump rightward in steps of ⌊√n⌋ until ' +
      'a[min(pos,n)-1] ≥ target or out of range, then linearly scan the located block [prev, min(pos,n)). ' +
      '\n- Step size √n is the optimum minimizing (jumps + in-block comparisons). ' +
      '\n- Total comparisons are fixed at O(√n); friendlier than binary search on storage where ' +
      'random reads are costly and sequential prefetch is cheap.',
  },
  tags: ['searching', 'sorted', 'jump', 'optimal-block'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};

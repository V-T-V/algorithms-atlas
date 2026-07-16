// 随机化快速选择 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quickselect-randomized',
  categoryId: 'selection',
  title: { zh: '随机化快速选择', en: 'Randomized Quickselect' },
  summary: {
    zh: '随机选基准避免最坏情况，期望 O(n) 找第 k 小。',
    en: 'Randomize the pivot to avoid worst case; find k-th smallest in expected O(n).',
  },
  description: {
    zh: '在 Lomuto 框架之上，每次划分前在 [lo, hi] 区间内随机选一个下标并与最右端交换，从而消除特定输入导致 O(n²) 退化的可能性（与输入顺序无关）。\n\n- 用线性同余发生器（固定种子）产生伪随机数，结果可复现\n- 期望时间 O(n)，最坏 O(n²) 但出现概率极低\n- 是工业库（如 C++ std::nth_element 的一种实现思路）的核心技巧',
    en: 'On top of Lomuto, before each partition we pick a random index in [lo, hi] and swap it with the rightmost, eliminating input-dependent worst-case O(n²) behavior.\n\n- Uses a linear congruential generator with a fixed seed for reproducibility\n- Expected O(n), worst O(n²) but with negligibly low probability\n- Core technique behind industrial libraries (e.g. C++ std::nth_element)',
  },
  tags: ['divide-and-conquer', 'randomized', 'order-statistics'],
  complexity: { time: 'O(n) 期望', space: 'O(log n)' },
};

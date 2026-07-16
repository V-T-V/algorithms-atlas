// Sattolo 循环 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-sattolo-cycle',
  categoryId: 'randomized',
  title: { zh: 'Sattolo 循环', en: 'Sattolo Cycle' },
  summary: {
    zh: '生成单个随机循环（n 个元素的循环置换），Fisher-Yates 的 k<n 变体。',
    en: 'Generates a single random cycle (cyclic permutation of n elements); a k<n variant of Fisher-Yates.',
  },
  description: {
    zh: 'Sattolo 算法把数组洗成恰好一个长度为 n 的循环：对 i 从 n-1 到 1，从 [0,i) 随机选 j 并交换 a[i],a[j]。结果是一个随机循环置换（不同于 Fisher-Yates 的全排列）。',
    en: "Sattolo's algorithm shuffles an array into exactly one cycle of length n: for i from n-1 down to 1, pick j uniformly in [0,i) and swap a[i],a[j]. The result is a random cyclic permutation (distinct from Fisher-Yates's full permutation).",
  },
  tags: ['randomized', 'permutation', 'cycle', 'sattolo'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

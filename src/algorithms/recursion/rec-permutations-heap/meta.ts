// Heap 算法生成全排列 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-permutations-heap',
  categoryId: 'recursion',
  title: { zh: 'Heap 算法全排列', en: 'Heap Algorithm Permutations' },
  summary: {
    zh: 'Heap 算法：每次只交换两个元素即可生成下一个排列，n! 个排列仅需 n! 次交换。',
    en: 'Heaps algorithm: generates each next permutation with a single swap, producing n! permutations in n! swaps.',
  },
  description: {
    zh: 'Heap 算法（B.R. Heap, 1963）是生成全排列的最高效递归算法之一。其核心性质：每次只交换两个元素就能从一个排列得到下一个排列，共 n! 个排列仅需 n! 次交换（最小交换次数）。递归形式：generate(k)：若 k=1 输出当前排列；否则 generate(k-1)，然后对 i=0..k-2 交换 a[(k 偶 ? i : 0)] 与 a[k-1] 后再 generate(k-1)。本实现提供递归与迭代两种形式。',
    en: 'Heaps algorithm (B.R. Heap, 1963) is one of the most efficient recursive methods for generating all permutations. Its key property: each next permutation is reached by swapping exactly two elements, so n! permutations need only n! swaps (the minimum). Recursive form: generate(k): if k=1 output; else generate(k-1), then for i=0..k-2 swap a[(k even ? i : 0)] with a[k-1] and recurse generate(k-1). This implementation provides both recursive and iterative forms.',
  },
  tags: ['recursion', 'permutation', 'heap-algorithm', 'swap'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
};

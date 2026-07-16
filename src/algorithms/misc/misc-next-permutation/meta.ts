// 下一个排列 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-next-permutation',
  categoryId: 'misc',
  title: { zh: '下一个排列', en: 'Next Permutation' },
  summary: {
    zh: '字典序意义下「原地」求下一个排列，已是最大则翻转为最小。',
    en: 'In-place next permutation in lexicographic order; wrap to the smallest if already largest.',
  },
  description: {
    zh: '下一个排列（LeetCode 31，STL next_permutation）：\n\n1. 从右往左找第一个满足 a[i] < a[i+1] 的 i（降序断点）。\n2. 若不存在，整个数组降序，已是最大，翻转为最小。\n3. 否则从右往左找第一个 a[j] > a[i]，交换 a[i]/a[j]。\n4. 反转 a[i+1..] 使其升序（变最小后缀）。',
    en: 'Next permutation (LeetCode 31, STL next_permutation):\n\n1. Scan right-to-left for the first i with a[i] < a[i+1] (descent break).\n2. If none, the array is fully descending (largest); reverse to smallest.\n3. Otherwise find rightmost j with a[j] > a[i], swap a[i]/a[j].\n4. Reverse a[i+1..] to make it the smallest suffix.',
  },
  tags: ['misc', 'array', 'permutation', 'lexicographic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

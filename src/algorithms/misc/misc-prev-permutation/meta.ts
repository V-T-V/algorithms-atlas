// 上一个排列 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-prev-permutation',
  categoryId: 'misc',
  title: { zh: '上一个排列', en: 'Previous Permutation' },
  summary: {
    zh: '字典序意义下「原地」求上一个排列，已是最小则翻转为最大。',
    en: 'In-place previous permutation in lexicographic order; wrap to the largest if already smallest.',
  },
  description: {
    zh: '上一个排列是 next_permutation 的镜像（STL prev_permutation）：\n\n1. 从右往左找第一个满足 a[i] > a[i+1] 的 i（升序断点）。\n2. 若不存在，已是最小，翻转为最大。\n3. 否则从右往左找第一个 a[j] < a[i]，交换。\n4. 反转 a[i+1..] 使其降序（变最大后缀）。',
    en: 'Previous permutation mirrors next_permutation (STL prev_permutation):\n\n1. Scan right-to-left for the first i with a[i] > a[i+1] (ascent break).\n2. If none, already smallest; reverse to largest.\n3. Otherwise find rightmost j with a[j] < a[i], swap.\n4. Reverse a[i+1..] to make it the largest suffix.',
  },
  tags: ['misc', 'array', 'permutation', 'lexicographic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

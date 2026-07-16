// Subsets II (含重复元素的子集) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bt-subset-with-dup',
  categoryId: 'backtracking',
  title: { zh: '含重复元素的子集 II', en: 'Subsets II' },
  summary: {
    zh: '对含重复元素的数组枚举去重后的所有子集。',
    en: 'Enumerate all deduplicated subsets of an array with duplicates.',
  },
  description: {
    zh: '先排序，再回溯：同一层中跳过与前一个相等的元素，从而避免产生重复子集。',
    en: 'Sort first, then backtrack: at each recursion level skip an element equal to the previous sibling, avoiding duplicate subsets.',
  },
  tags: ['backtracking', 'dedup'],
  complexity: { time: 'O(n·2ⁿ)', space: 'O(n)' },
};

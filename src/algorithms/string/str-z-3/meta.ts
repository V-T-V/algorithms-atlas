import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-z-3',
  categoryId: 'string',
  title: { zh: 'Z 算法（Z 函数）', en: 'Z Algorithm (Z Function)' },
  summary: {
    zh: 'O(n) 计算 z[i]：从 i 起的最长公共前缀（与整串）。',
    en: 'O(n) computes z[i]: longest common prefix between s and s[i..].',
  },
  description: {
    zh: '维护 [l, r] 为当前最右覆盖前缀的区间，利用对称性加速。',
    en: 'Maintains the rightmost [l, r] matching a prefix, exploiting symmetry to speed up.',
  },
  tags: ['string', 'z-algorithm', 'lcp'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

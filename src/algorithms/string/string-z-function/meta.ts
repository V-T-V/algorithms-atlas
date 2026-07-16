// Z 函数（exposed Z-array）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-z-function',
  categoryId: 'string',
  title: { zh: 'Z 函数（Z 数组）', en: 'Z-Function (Z-Array)' },
  summary: {
    zh: 'Z[i] = s 与 s[i..] 的最长公共前缀长度，O(n) 求解。',
    en: 'Z[i] = length of longest common prefix of s and s[i..], computed in O(n).',
  },
  description: {
    zh: 'Z 函数（Z-algorithm）维护当前最靠右的匹配段 [l,r]，借助对称性在 O(n) 内求出 Z 数组：Z[i] 表示后缀 s[i..] 与原串 s 的最长公共前缀长度。可一次性完成模式匹配（拼接 p#t 后看 Z）。本实现聚焦 Z 数组本身的计算与应用（去重子串计数等），区别于已有的 z-function（实现路径与可视化侧重不同）。提供 computeZ、zPatternSearch 双接口。',
    en: 'The Z-algorithm maintains the rightmost matched segment [l,r] and uses symmetry to compute the Z-array in O(n): Z[i] is the LCP of suffix s[i..] with s. Enables one-pass pattern matching (concatenate p#t, read off Z). This focuses on the Z-array computation itself and an alternative implementation path distinct from the existing z-function. Provides computeZ and zPatternSearch.',
  },
  tags: ['string', 'z-function', 'lcp', 'pattern-matching'],
  complexity: { time: 'O(n+m)', space: 'O(n+m)' },
};

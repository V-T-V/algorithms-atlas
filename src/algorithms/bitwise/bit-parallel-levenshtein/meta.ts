// 位并行 Levenshtein · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-parallel-levenshtein',
  categoryId: 'bitwise',
  title: { zh: '位并行 Levenshtein 距离', en: 'Bit-parallel Levenshtein Distance' },
  summary: {
    zh: 'Myers 算法：用位向量在 O(n/ w) 求编辑距离。',
    en: 'Myers algorithm: bit-vector edit distance in O(n/w) word operations.',
  },
  description: {
    zh: 'Myers 位并行算法把动态规划表的「差分」编码到位向量里，每个机器字一次处理 32/64 列，从而把 Levenshtein 编辑距离的计算从 O(mn) 降到 O(mn / w) 次字运算。它以模式串每个字符的「位置位图」Peq[c] 为预处理，运行期用 PV、MV、Score 三个字滚动推进。',
    en: 'Myers bit-parallel algorithm encodes the differences of the DP table into bit vectors, processing 32/64 columns per machine word, reducing Levenshtein edit distance from O(mn) to O(mn/w) word operations. It precomputes a position bitmask Peq[c] for each character of the pattern, then rolls PV, MV and Score words during the search.',
  },
  tags: ['bitwise', 'string', 'edit-distance', 'bit-parallel'],
  complexity: { time: 'O(⌈m/w⌉·n)', space: 'O(m)' },
};

// Interleaving String · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-interleaving-string',
  categoryId: 'dp',
  title: { zh: '交错字符串', en: 'Interleaving String' },
  summary: {
    zh: '判断 s3 是否由 s1、s2 交错组成。',
    en: 'Determine whether s3 is formed by interleaving s1 and s2.',
  },
  description: {
    zh: '给定 s1、s2、s3，判断 s3 是否可由 s1 与 s2 交错拼接而成（保持各自字符相对顺序）。dp[i][j] 表示 s1 前 i 个、s2 前 j 个能否交错成 s3 前 i+j 个。dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1]) || (dp[i][j-1] && s2[j-1]==s3[i+j-1])。时间 O(|s1|·|s2|)。',
    en: 'Given s1, s2, s3, decide whether s3 is an interleaving of s1 and s2 (preserving each string order). dp[i][j] = whether the first i of s1 and first j of s2 interleave to the first i+j of s3. dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1]) || (dp[i][j-1] && s2[j-1]==s3[i+j-1]). Time O(|s1|·|s2|).',
  },
  tags: ['dp', 'string', 'interleaving', '2d-dp'],
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
};

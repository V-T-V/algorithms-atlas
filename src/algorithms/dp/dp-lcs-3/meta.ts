import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-lcs-3',
  categoryId: 'dp',
  title: { zh: 'LCS 三维（三串最长公共子序列）', en: 'LCS of Three Strings' },
  summary: {
    zh: '求三个字符串的最长公共子序列长度，三维 DP。',
    en: 'Longest common subsequence among three strings via 3D DP.',
  },
  description: {
    zh: '令 dp[i][j][k] = s1[0..i-1], s2[0..j-1], s3[0..k-1] 的 LCS 长度。若三串末字符相同则 dp[i][j][k]=dp[i-1][j-1][k-1]+1；否则取 dp[i-1][j][k], dp[i][j-1][k], dp[i][j][k-1] 的最大值。时间 O(n1·n2·n3)，空间可滚动到 O(n2·n3)。',
    en: 'dp[i][j][k] = LCS of prefixes. If all three end-characters match, dp[i-1][j-1][k-1]+1; else max of three shrinkings. Time O(n1·n2·n3).',
  },
  tags: ['dp', 'lcs', '3d'],
  complexity: { time: 'O(n1·n2·n3)', space: 'O(n1·n2·n3)' },
};

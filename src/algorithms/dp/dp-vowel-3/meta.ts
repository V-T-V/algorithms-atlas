import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-vowel-3',
  categoryId: 'dp',
  title: { zh: '元音字符串计数', en: 'Count Vowel Strings of Length n' },
  summary: {
    zh: '长度 n、仅由 a/e/i/o/u 组成且按元音字典序非递减的字符串数。',
    en: 'Count length-n strings over a/e/i/o/u, non-decreasing in vowel order.',
  },
  description: {
    zh: 'dp[k][v]=长度 k、结尾元音 <=v 的串数。dp[k][v]=dp[k-1][v]+dp[k][v-1]。',
    en: 'dp[k][v]=count length k ending with vowel <=v. dp[k][v]=dp[k-1][v]+dp[k][v-1].',
  },
  tags: ['dp', 'combinatorics', 'counting'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-split-3',
  categoryId: 'dp',
  title: { zh: '整数拆分（最大积）', en: 'Integer Break (Max Product)' },
  summary: {
    zh: '把整数 n 拆成至少两个正整数之和，使乘积最大。',
    en: 'Split n into >=2 positive integers to maximize product.',
  },
  description: {
    zh: 'dp[i] = 把 i 拆分得到的最大积。dp[i]=max(j * (i-j), j * dp[i-j])，遍历 j。',
    en: 'dp[i]=max product of split i. dp[i]=max(j*(i-j), j*dp[i-j]) over j.',
  },
  tags: ['dp', 'integer-break', 'math'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};

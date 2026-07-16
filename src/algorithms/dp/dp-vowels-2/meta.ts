import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-vowels-2',
  categoryId: 'dp',
  title: { zh: '元音拼写计数', en: 'Count Vowels Permutation' },
  summary: {
    zh: '每个元音字母后只能跟某些元音，求长度为 n 的合法元音序列数。',
    en: 'Each vowel permits only certain following vowels; count length-n vowel strings.',
  },
  description: {
    zh: 'LeetCode 1220。五个元音 a/e/i/o/u 各有后继规则。dp[v] 表示以 v 结尾的当前长度方案数，按规则滚动。',
    en: 'LC 1220. Five vowels with successor rules; roll dp[v] = count ending in v each step.',
  },
  tags: ['dp', 'counting', 'permutation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

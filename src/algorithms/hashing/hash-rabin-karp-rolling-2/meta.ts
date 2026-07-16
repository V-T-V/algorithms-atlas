// Rabin-Karp 滚动（Rabin-Karp Rolling）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-rabin-karp-rolling-2',
  categoryId: 'hashing',
  title: { zh: 'Rabin-Karp 滚动', en: 'Rabin-Karp Rolling' },
  summary: {
    zh: '滑动窗口哈希 O(1) 更新：减去离开位、乘基数、加进入位。',
    en: 'Sliding-window hash in O(1): subtract outgoing, multiply base, add incoming.',
  },
  description: {
    zh: '滚动哈希：H(s[i+1..i+m]) = ((H(s[i..i+m-1]) - s[i]*base^(m-1)) * base + s[i+m]) mod p。',
    en: 'Rolling hash: H(s[i+1..i+m]) = ((H(s[i..i+m-1]) - s[i]*base^(m-1)) * base + s[i+m]) mod p.',
  },
  tags: ['hashing', 'rolling-hash', 'rabin-karp'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

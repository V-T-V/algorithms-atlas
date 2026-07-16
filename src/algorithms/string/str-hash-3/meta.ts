import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-hash-3',
  categoryId: 'string',
  title: { zh: '多项式字符串哈希', en: 'Polynomial String Hash' },
  summary: {
    zh: '预处理前缀哈希，O(1) 查询任意子串哈希。',
    en: 'Precomputes prefix hashes; O(1) arbitrary substring hash queries.',
  },
  description: {
    zh: '把字符串视为 base 进制数对 mod 取模，前缀和 + 二项式反乘即可。',
    en: 'Treats the string as a base-mod number; prefix sums + inverse powers give substring hash.',
  },
  tags: ['string', 'hash', 'prefix'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

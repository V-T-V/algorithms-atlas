import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-suffix-array-3',
  categoryId: 'string',
  title: { zh: '后缀数组（SA · 倍增构造）', en: 'Suffix Array (Doubling)' },
  summary: {
    zh: 'O(n log n) 倍增构造 SA 与 height 数组，是许多字符串题的基础。',
    en: 'O(n log n) doubling construction of SA and height arrays; foundation for many string problems.',
  },
  description: {
    zh: '每轮用前 2^k 个字符的排名作为关键字重排，log n 轮后得到完整顺序。',
    en: 'Each round re-sorts by the ranks of the first 2^k chars; after log n rounds the full order emerges.',
  },
  tags: ['string', 'suffix-array'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-kmp-4',
  categoryId: 'string',
  title: { zh: 'KMP（含前缀函数优化）', en: 'KMP (with prefix-function optimization)' },
  summary: {
    zh: '通过前缀函数在 O(n+m) 内完成模式匹配，无文本指针回退。',
    en: 'Prefix function achieves O(n+m) matching with no text-pointer backtracking.',
  },
  description: {
    zh: '先求模式串的前缀函数 pi，再扫描文本利用 pi 跳过已匹配前缀。',
    en: 'Compute the pattern prefix function pi, then scan text using pi to skip matched prefixes.',
  },
  tags: ['string', 'kmp', 'matching'],
  complexity: { time: 'O(n + m)', space: 'O(m)' },
};

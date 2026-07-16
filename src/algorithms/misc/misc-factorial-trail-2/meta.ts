// 阶乘末尾零（朴素） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-factorial-trail-2',
  categoryId: 'misc',
  title: { zh: '阶乘末尾零（朴素）', en: 'Factorial Trailing Zeros (Naive)' },
  summary: {
    zh: '直接数 n! 字符串末尾有多少个 0（小规模教学）。',
    en: 'Directly count trailing zeros in n! as a string (small-scale teaching).',
  },
  description: {
    zh: '朴素方法：算出 n!（用 BigInt），转字符串数末尾 0。仅适合小 n。',
    en: 'Naive method: compute n! (via BigInt), count trailing 0s in the string. Only for small n.',
  },
  tags: ['misc', 'math', 'bigint'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};

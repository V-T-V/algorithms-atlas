// 递归幂 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-power-rec-2',
  categoryId: 'recursion',
  title: { zh: '递归幂', en: 'Recursive Power (a^b)' },
  summary: {
    zh: '递归实现 a^b = a · a^(b−1)，整数幂。',
    en: 'Recursive power: a^b = a · a^(b−1) for integer exponent.',
  },
  description: {
    zh: '递归幂：基线 b=0 返回 1；否则 a · a^(b−1)。',
    en: 'Recursive power: base b=0 returns 1; otherwise a · a^(b−1).',
  },
  tags: ['recursion', 'arithmetic'],
  complexity: { time: 'O(b)', space: 'O(b)' },
};

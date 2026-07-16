import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-boyer-moore-3',
  categoryId: 'string',
  title: { zh: 'Boyer-Moore（坏字符规则）', en: 'Boyer-Moore (Bad Character Heuristic)' },
  summary: {
    zh: '从右向左比较，用坏字符规则大步跳跃。',
    en: 'Compares right-to-left, using the bad-character rule for large jumps.',
  },
  description: {
    zh: '失配时按坏字符在模式中最右位置对齐，子线性平均复杂度。',
    en: 'On mismatch, aligns to the bad character rightmost occurrence in the pattern; sub-linear average.',
  },
  tags: ['string', 'boyer-moore', 'matching'],
  complexity: { time: 'O(n/m)~O(nm)', space: 'O(σ)' },
};

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-left-recursion',
  categoryId: 'parsing',
  title: { zh: '消除左递归', en: 'Left Recursion Elimination' },
  summary: {
    zh: '把直接左递归文法改写为等价的右递归形式，便于自顶向下解析。',
    en: 'Rewrite a directly left-recursive grammar into an equivalent right-recursive form.',
  },
  description: {
    zh: 'A → A α | β 改为 A → β A′, A′ → α A′ | ε。消除递归下降的无限递归。',
    en: 'A → A α | β becomes A → β A′, A′ → α A′ | ε, removing the cycle for top-down parsers.',
  },
  tags: ['parsing', 'grammar', 'rewrite'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

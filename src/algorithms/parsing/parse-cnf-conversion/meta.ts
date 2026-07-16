import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-cnf-conversion',
  categoryId: 'parsing',
  title: { zh: 'Chomsky 范式化', en: 'Grammar to Chomsky Normal Form' },
  summary: {
    zh: '把 CFG 改写为 A → BC | a 形式，是 CYK 的前置。',
    en: 'Convert a CFG to Chomsky Normal Form (A → BC | a), a precondition for CYK.',
  },
  description: {
    zh: '步骤：长产生式拆为二元（A → X1 X2 X3 X4 拆为 A → X1 N1, N1 → X2 N2, N2 → X3 X4）；终结符包成新非终结符。',
    en: 'Binarize long productions; wrap terminals in fresh non-terminals; result rules have 2 non-terminals or 1 terminal.',
  },
  tags: ['parsing', 'grammar', 'cfg', 'cnf'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-left-factor',
  categoryId: 'parsing',
  title: { zh: '提取左公共因子', en: 'Left Factoring' },
  summary: {
    zh: '把共享前缀的产生式拆为公共前缀 + 新非终结符。',
    en: 'Split alternatives sharing a common prefix into prefix plus a new non-terminal.',
  },
  description: {
    zh: 'A → α β₁ | α β₂ 改为 A → α A″, A″ → β₁ | β₂。消除 FIRST 集冲突，使 LL(1) 可行。',
    en: 'A → α β₁ | α β₂ becomes A → α A″, A″ → β₁ | β₂, removing FIRST-set ambiguity.',
  },
  tags: ['parsing', 'grammar', 'rewrite'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};

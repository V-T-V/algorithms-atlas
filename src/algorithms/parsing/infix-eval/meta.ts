// Infix Expression Evaluation · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'infix-eval',
  categoryId: 'parsing',
  title: { zh: '中缀表达式求值', en: 'Infix Expression Evaluation' },
  summary: {
    zh: '中缀表达式求值属于parsing类别。',
    en: 'Infix Expression Evaluation is a parsing algorithm.',
  },
  description: {
    zh: '中缀表达式求值（Infix Expression Evaluation）属于parsing类别的算法。',
    en: 'Infix Expression Evaluation is an algorithm in the parsing category.',
  },
  tags: ["parsing"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

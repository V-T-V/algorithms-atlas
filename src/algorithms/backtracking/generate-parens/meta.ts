// Generate Parens · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'generate-parens',
  categoryId: 'backtracking',
  title: { zh: '括号生成', en: 'Generate Parens' },
  summary: {
    zh: '括号生成属于backtracking类别。',
    en: 'Generate Parens is a backtracking algorithm.',
  },
  description: {
    zh: '括号生成（Generate Parens）属于backtracking类别的算法。',
    en: 'Generate Parens is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

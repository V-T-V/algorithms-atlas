import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-grammar-ambiguity',
  categoryId: 'parsing',
  title: { zh: 'CFG 歧义检测', en: 'CFG Ambiguity Detection' },
  summary: {
    zh: '启发式检测文法歧义（共享 FIRST 集 / 同时左右递归）。',
    en: 'Heuristically flag patterns that often cause ambiguity.',
  },
  description: {
    zh: 'CFG 歧义性不可判定，但可检测常见模式：多产生式共享 FIRST，或同一非终结符同时左右递归。',
    en: 'Ambiguity is undecidable; we flag shared FIRST sets or simultaneous left/right recursion.',
  },
  tags: ['parsing', 'grammar', 'ambiguity'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};

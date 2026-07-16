// 花括号展开 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-brace-expand',
  categoryId: 'backtracking',
  title: { zh: '花括号展开', en: 'Brace Expansion' },
  summary: {
    zh: '展开 {a,b}c{d,e} 形式的表达式为所有单词。',
    en: 'Expand {a,b}c{d,e} into all words.',
  },
  description: { zh: '回溯每组选项笛卡尔积。', en: 'Backtrack Cartesian product. O(k^n).' },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(k^n)', space: 'O(n)' },
};

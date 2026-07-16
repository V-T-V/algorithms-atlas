// 不同括号求值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-different-ways-paren',
  categoryId: 'backtracking',
  title: { zh: '不同括号求值', en: 'Different Ways to Add Parentheses' },
  summary: {
    zh: '给表达式加不同括号得到的所有可能值。',
    en: 'All possible values by adding parens differently.',
  },
  description: { zh: '分治：找每个运算符切分左右。', en: 'Divide at each operator. O(4^n/n).' },
  tags: ['backtracking', 'divide-conquer'],
  complexity: { time: 'O(4^n / n)', space: 'O(n)' },
};

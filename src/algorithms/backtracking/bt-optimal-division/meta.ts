// 最优除法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-optimal-division',
  categoryId: 'backtracking',
  title: { zh: '最优除法', en: 'Optimal Division' },
  summary: {
    zh: '给一串正整数连除，加括号使结果最大，返回加括号表达式。',
    en: 'Add parentheses to a chain of divisions of positive integers to maximize the result, returning the expression.',
  },
  description: {
    zh: '对 a/b/c/d… 最大值恒为 a/(b/c/d…)。当 n≤2 不需加括号。',
    en: 'For a/b/c/d… the maximum is always a/(b/c/d…). No parentheses needed when n≤2.',
  },
  tags: ['backtracking', 'math'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

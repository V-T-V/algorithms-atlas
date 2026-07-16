// 表达式加减 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-expression-add',
  categoryId: 'backtracking',
  title: { zh: '表达式加减', en: 'Expression Add Operators' },
  summary: {
    zh: '在数字串中插入 + - * 使表达式等于目标值。',
    en: 'Insert + - * into digit string to reach target.',
  },
  description: {
    zh: '回溯，每步选运算符与操作数。',
    en: 'Backtrack operators and operands. O(4^n).',
  },
  tags: ['backtracking', 'expression'],
  complexity: { time: 'O(4^n)', space: 'O(n)' },
};

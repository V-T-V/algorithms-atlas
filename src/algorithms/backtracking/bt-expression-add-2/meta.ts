// 表达式加运算符 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-expression-add-2',
  categoryId: 'backtracking',
  title: { zh: '表达式加运算符 (LeetCode 282)', en: 'Expression Add Operators' },
  summary: {
    zh: '回溯在数字间插入 + - * 使表达式等于目标值。',
    en: 'Backtrack inserting + - * between digits so the expression evaluates to target.',
  },
  description: {
    zh: '枚举每段数字（含前导零限制）与运算符，处理乘法优先级（保存上一项），收集所有等于 target 的表达式。',
    en: 'Enumerate each numeric segment (no leading zeros) and operator, handle multiplication precedence (keeping the previous operand), collect expressions equal to target.',
  },
  tags: ['backtracking', 'expression', 'arithmetic'],
  complexity: { time: 'O(4^n)', space: 'O(n)' },
};

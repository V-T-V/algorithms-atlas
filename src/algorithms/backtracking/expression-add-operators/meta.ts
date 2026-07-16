// 表达式加运算符（Expression Add Operators）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'expression-add-operators',
  categoryId: 'backtracking',
  title: { zh: '表达式加运算符', en: 'Expression Add Operators' },
  summary: {
    zh: '在数字串中插入 +、-、* 使其求值等于目标。',
    en: 'Insert +, -, * into a digit string so it evaluates to target.',
  },
  description: {
    zh: '给定一个只包含数字的字符串 num 和一个目标整数 target，在 num 的数字之间插入二元运算符 +、-、*（不插入也行，即把相邻数字拼成一个多位数），构造出所有求值结果等于 target 的表达式。\n\n回溯思路：枚举每一个「数段」的结束位置，并在两段之间选择运算符。难点在于乘法优先级高：需维护「上一步的累积值 sum」「上一步最后加/减的操作数 last」——遇到乘法时，撤销 last 的影响，改成 last 乘以 cur。还要处理前导零（如 05 非法）。',
    en: 'Given a digit string num and a target integer, insert binary operators plus, minus, star (or none, to concatenate adjacent digits into a multi-digit number) so the expression evaluates to target; return all such expressions.\n\nBacktracking: enumerate the end position of each number segment and pick an operator between segments. The catch is operator precedence for the star operator: maintain the running sum and the last operand added/subtracted — on a multiply, undo last and replace it with last times cur. Also reject leading zeros like 05.',
  },
  tags: ['backtracking', 'expression', 'arithmetic'],
  complexity: { time: 'O(4ⁿ)', space: 'O(n)' },
  references: [
    { label: 'LeetCode 282', url: 'https://leetcode.com/problems/expression-add-operators/' },
  ],
  defaultInput: { num: '123', target: 6 },
};

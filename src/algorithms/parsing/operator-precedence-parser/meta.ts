// 算符优先分析 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'operator-precedence-parser',
  categoryId: 'parsing',
  title: { zh: '算符优先分析', en: 'Operator Precedence Parsing' },
  summary: {
    zh: '用算符优先关系表（栈顶 vs 输入）移进-归约解析表达式。',
    en: 'Shift-reduce using an operator-precedence table comparing stack top vs input.',
  },
  description: {
    zh: '算符优先分析（Operator Precedence Parsing）适用于一类「算符优先文法」（OPG），常用于表达式解析。维护一个符号栈与剩余输入，比较「栈顶算符」与「当前输入算符」的优先关系：\n- 栈顶 < 输入：移进（shift）\n- 栈顶 > 输入：归约（reduce，把栈顶的 操作数 算符 操作数 合并为新操作数）\n- 栈顶 = 输入：通常为括号配对，弹出\n\n本实现用内置优先级表（+− 1，*/2，^3），支持括号，求值的同时产出归约步骤。',
    en: 'Operator precedence parsing works for operator-precedence grammars, common for expressions. Maintain a symbol stack and remaining input; compare stack-top operator vs current input operator precedence: less-than shifts, greater-than reduces (combining operand-operator-operand), equal pops (paren matching). Built-in precedence +−=1, */=2, ^=3, with parentheses.',
  },
  tags: ['parsing', 'operator-precedence', 'shift-reduce', 'expression'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

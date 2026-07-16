// 数学表达式解析（支持函数调用）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-expression-parser',
  categoryId: 'parsing',
  title: { zh: '数学表达式解析（含函数）', en: 'Math Expression Parser (with Functions)' },
  summary: {
    zh: '递归下降解析含一元负号、函数调用（sin/max/...）与 +−*/^ 的表达式。',
    en: 'Recursive descent parsing with unary minus, function calls (sin/max/...) and +−*/^.',
  },
  description: {
    zh: '解析并求值数学表达式，支持：\n- 二元运算 + − * / ^\n- 一元负号 −x\n- 函数调用 name(arg1, arg2, ...)，如 sin(0), max(2,3)\n- 括号 ( ... )\n- 数字（整数与浮点）\n\n递归下降文法：\n- expr → term ((+|−) term)*\n- term → factor ((*|/) factor)*\n- factor → power\n- power → unary (^ factor)?  （右结合）\n- unary → (−|+) unary | atom\n- atom → number | (expr) | func(args)\n\n内置函数：sin cos tan sqrt abs exp ln log max min pow。可扩展。',
    en: 'Evaluate math expressions with binary +−*/^, unary minus, parentheses, numbers, and function calls like sin(0), max(2,3). Recursive-descent grammar with right-associative ^ and unary prefix. Built-ins: sin cos tan sqrt abs exp ln log max min pow.',
  },
  tags: ['parsing', 'math', 'expression', 'recursive-descent', 'function'],
  complexity: { time: 'O(n)', space: 'O(d)' },
};

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-rpn-eval',
  categoryId: 'parsing',
  title: { zh: '逆波兰求值', en: 'Reverse Polish Notation Eval' },
  summary: {
    zh: '用栈对后缀表达式求值：遇操作数入栈，遇运算符弹栈计算。',
    en: 'Evaluate a postfix (RPN) expression with a stack.',
  },
  description: {
    zh: '扫描后缀 token：操作数压栈；遇二元运算符弹两操作数按 (左 ⊙ 右) 计算后压栈；末了栈顶即结果。O(n)。',
    en: 'Scan postfix tokens: push operands; on binary op pop two, compute (left op right), push result. Final stack top is the answer.',
  },
  tags: ['parsing', 'stack', 'postfix', 'evaluation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

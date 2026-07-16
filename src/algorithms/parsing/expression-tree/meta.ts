// 表达式树构建与求值（后缀式）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'expression-tree',
  categoryId: 'parsing',
  title: { zh: '表达式树（后缀式）', en: 'Expression Tree (Postfix)' },
  summary: {
    zh: '从后缀表达式用栈构建表达式树，再后序遍历求值。',
    en: 'Build an expression tree from postfix via a stack, then post-order evaluate.',
  },
  description: {
    zh: '与递归下降的 AST 构建不同，本实现从「后缀表达式（逆波兰表示, RPN）」用栈构建表达式树：\n- 遇到操作数：压栈\n- 遇到二元算符：弹两个操作数作左右子，构造内部节点压栈\n- 结束后栈中唯一元素即根\n\n得到树后后序遍历求值。也可用中序遍历还原中缀（需加括号）。\n\n时间 O(n)，空间 O(n)。',
    en: 'Unlike recursive-descent AST building, this version builds an expression tree from postfix (Reverse Polish Notation) using a stack: operands push; a binary operator pops two operands as left/right children and pushes the new internal node. After processing, the stack holds the root. Post-order traversal evaluates; in-order (with parens) recovers infix. O(n) time and space.',
  },
  tags: ['parsing', 'expression-tree', 'postfix', 'rpn', 'stack'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

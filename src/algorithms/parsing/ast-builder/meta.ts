// AST 构建（表达式树）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ast-builder',
  categoryId: 'parsing',
  title: { zh: 'AST 构建（表达式树）', en: 'AST Builder (Expression Tree)' },
  summary: {
    zh: '递归下降把中缀表达式构建为抽象语法树（AST）节点。',
    en: 'Recursive-descent builds an abstract syntax tree (AST) from an infix expression.',
  },
  description: {
    zh: '把中缀算术表达式解析为抽象语法树（AST）。采用经典递归下降文法：\n- expr → term ((+ | −) term)*\n- term → factor ((* | /) factor)*\n- factor → number | ( expr )\n\n每个非终结符返回一个 AST 节点（BinOp 或 Num），组合成树。结果树可后续遍历求值或打印。AST 是编译器的核心中间表示。',
    en: 'Parse an infix arithmetic expression into an AST via classic recursive descent: expr → term ((+|-) term)*; term → factor ((*|/) factor)*; factor → number | (expr). Each non-terminal returns an AST node (BinOp or Num). The tree can be post-order evaluated or printed. ASTs are the central IR in compilers.',
  },
  tags: ['parsing', 'ast', 'recursive-descent', 'expression-tree', 'compiler'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

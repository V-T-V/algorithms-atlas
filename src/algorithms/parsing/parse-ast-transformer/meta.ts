// AST 变换器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-ast-transformer',
  categoryId: 'parsing',
  title: { zh: 'AST 变换器', en: 'AST Transformer' },
  summary: {
    zh: '用自底向上重写把一棵 AST 函数式地变换成另一棵等价/优化 AST。',
    en: 'Bottom-up rewrite to functionally transform one AST into an equivalent / optimized AST.',
  },
  description: {
    zh: 'AST 变换器（rewriter）递归地遍历每个节点，先变换其子节点，再用一个 rewrite(node, transformedChildren) 函数决定本节点的新形态。这是「自底向上 + 不可变」的转换：永远返回新树，输入树不变。典型用途：常量折叠、代数化简（x*1 → x、x+0 → x）、宏展开、语法糖脱糖、AST 规范化。本实现提供通用 transform 框架并内置两个示例重写器：算术折叠（对 BinOp 的 Num 子节点求值）与单位元消除。',
    en: 'An AST transformer (rewriter) recursively visits each node: first transform its children, then a rewrite(node, transformedChildren) function decides the new shape of this node. It is "bottom-up + immutable": always returning a fresh tree, the input tree is untouched. Typical uses: constant folding, algebraic simplification (x*1 → x, x+0 → x), macro expansion, desugaring, AST canonicalization. This implementation provides a generic transform framework with two example rewriters: arithmetic folding (evaluating BinOp over Num children) and identity elimination.',
  },
  tags: ['parsing', 'ast', 'transform', 'rewrite', 'compiler'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

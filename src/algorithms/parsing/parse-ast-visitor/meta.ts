// AST 访问者模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-ast-visitor',
  categoryId: 'parsing',
  title: { zh: 'AST 访问者模式', en: 'AST Visitor Pattern' },
  summary: {
    zh: '在不改变节点类的前提下，用访问者遍历 AST 并对各节点类型分派操作。',
    en: 'Traverse an AST and dispatch per-node-type operations via a visitor, without changing node classes.',
  },
  description: {
    zh: '访问者模式（Visitor）把「对节点的操作」从「节点结构」中解耦：节点只需提供 accept(visitor) 方法，访问者对每种节点类型实现一个 visitXxx 方法。本实现定义一个通用 AST 节点（type + children + 可选 value），并提供深度优先（前序/后序）与广度优先遍历器，访问者可在 enter/leave 时机执行副作用（如统计节点数、收集变量名、类型标注）。访问者便于扩展新操作而无需改动节点定义。',
    en: 'The Visitor pattern decouples operations on nodes from the node structure: a node only provides accept(visitor), while the visitor implements a visitXxx method per node type. This implementation defines a generic AST node (type + children + optional value) and provides depth-first (pre/post-order) and breadth-first traversals; a visitor may run side effects at enter/leave (e.g. counting nodes, collecting variable names, type annotation). Visitors make adding operations cheap without modifying node definitions.',
  },
  tags: ['parsing', 'ast', 'visitor', 'traversal'],
  complexity: { time: 'O(n)', space: 'O(d)' },
};

// Tree-sitter-style Incremental Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-sitter-style',
  categoryId: 'parsing',
  title: { zh: '增量解析器（tree-sitter 风格）', en: 'Incremental Parser (tree-sitter style)' },
  summary: {
    zh: 'tree-sitter 风格增量解析器在编辑后只重解析受影响区间的子树，并自带错误恢复（遇错不中断、用通配节点收集意外 token）。',
    en: 'A tree-sitter-style incremental parser re-parses only the subtrees in edited ranges after a change, and performs error recovery (continues on error, collecting unexpected tokens into wildcard nodes).',
  },
  description: {
    zh: '本算法模仿 tree-sitter 的核心思想：(1) 一次完整解析生成带区间的语法树；(2) 文本编辑后，依据新旧节点区间计算「受影响范围」，仅对落在该范围的节点重新解析，其余复用；(3) 解析器内置错误恢复——遇无法匹配的 token 时，创建 ERROR / MISSING 节点继续推进，而非整体失败。适合 IDE 实时高亮、代码补全等场景。零 DOM 依赖，可独立单测。',
    en: "This algorithm emulates tree-sitter's core ideas: (1) a full parse produces a syntax tree annotated with ranges; (2) after an edit, only nodes whose ranges intersect the affected region are re-parsed, the rest are reused; (3) the parser has built-in error recovery—on an unexpected token it creates ERROR/MISSING nodes and continues instead of failing wholesale. Suited for IDE real-time highlighting and completion. Zero DOM dependencies, independently unit-testable.",
  },
  tags: ['parsing', 'incremental', 'error-recovery', 'ide'],
  complexity: { time: 'O(n) 增量', space: 'O(n)' },
};

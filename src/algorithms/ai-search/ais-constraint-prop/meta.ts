// 约束传播搜索（Constraint Propagation Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-constraint-prop',
  categoryId: 'ai-search',
  title: { zh: '约束传播搜索', en: 'Constraint Propagation Search' },
  summary: {
    zh: '回溯 + AC-3 弧一致性传播：每步赋值后剪除不可能取值。',
    en: 'Backtracking + AC-3 arc consistency: prune impossible values after each assignment.',
  },
  description: {
    zh: '将回溯搜索与 AC-3 弧一致性传播结合：每次给变量赋值后，对约束图运行 AC-3，删除不可能取值。域被清空的变量触发回溯。广泛用于 CSP（图着色、数独等）。',
    en: 'Interleave backtracking with AC-3 arc consistency: after assigning a variable, run AC-3 on the constraint graph to remove impossible values. An emptied domain triggers backtracking. Widely used for CSPs (graph coloring, Sudoku).',
  },
  tags: ['ai-search', 'csp', 'constraint', 'ac-3', 'backtracking'],
  complexity: { time: 'O(ed³ max d)', space: 'O(e + nd)' },
};

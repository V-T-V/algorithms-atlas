// 贪心 Steiner 树（Greedy Steiner Tree）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-steiner-tree',
  categoryId: 'greedy',
  title: { zh: '贪心 Steiner 树', en: 'Greedy Steiner Tree' },
  summary: {
    zh: '在图中连接指定终端集，贪心扩展距离最近终端，近似比 2(1-1/l)。',
    en: 'Connect a terminal set; greedily attach nearest terminal for 2(1-1/l) ratio.',
  },
  description: {
    zh: 'Steiner 树：连接终端集 T 的最小权重子树。贪心（Mehlhorn）：先求 T 的度量闭包，再 MST，2(1-1/|T|) 近似。',
    en: 'Steiner tree: min-weight subtree connecting terminals T. Greedy (Mehlhorn): metric closure + MST gives 2(1-1/|T|) ratio.',
  },
  tags: ['greedy', 'tree', 'graph'],
  complexity: { time: 'O(|T|·(E log V))', space: 'O(V²)' },
};

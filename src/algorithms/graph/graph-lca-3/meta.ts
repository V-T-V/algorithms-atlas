import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-lca-3',
  categoryId: 'graph',
  title: { zh: '最近公共祖先（倍增）', en: 'Lowest Common Ancestor (Binary Lifting)' },
  summary: {
    zh: '预处理 fa[k][v] 后 O(log n) 回答树上任意两点的 LCA。',
    en: 'Preprocess binary-lifting table; answer LCA queries in O(log n) each.',
  },
  description: {
    zh: 'fa[k][v] 表示 v 向上跳 2^k 步到的祖先。查询 u,v 时先把深者提到与浅者同高，再二进制一起向上跳直到相遇。',
    en: 'fa[k][v] = ancestor 2^k steps above v. Lift the deeper node to match depth, then jump together.',
  },
  tags: ['graph', 'tree', 'lca', 'binary-lifting'],
  complexity: { time: 'O((n+q) log n)', space: 'O(n log n)' },
};

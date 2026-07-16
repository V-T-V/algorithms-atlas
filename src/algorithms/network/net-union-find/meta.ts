// 并查集 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-union-find',
  categoryId: 'network',
  title: { zh: '并查集', en: 'Union-Find' },
  summary: {
    zh: '带路径压缩与按秩合并的并查集。',
    en: 'Disjoint-set with path compression and union by rank.',
  },
  description: {
    zh: 'find 路径压缩，union 按秩合并，近 O(1) 均摊。',
    en: 'Path compression + union by rank. O(α(n)) amortized.',
  },
  tags: ['network', 'graph', 'union-find'],
  complexity: { time: 'O(α(n))', space: 'O(n)' },
};

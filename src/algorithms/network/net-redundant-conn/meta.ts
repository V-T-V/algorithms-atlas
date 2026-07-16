// 冗余连接 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-redundant-conn',
  categoryId: 'network',
  title: { zh: '冗余连接', en: 'Redundant Connection' },
  summary: {
    zh: '无向图加一条边成环，找出那条多余边。',
    en: 'Find the extra edge that creates a cycle.',
  },
  description: {
    zh: '并查集：第一条 union 失败的边即答案。',
    en: 'Union-find; first failed union is answer. O(E α).',
  },
  tags: ['network', 'graph', 'union-find'],
  complexity: { time: 'O(E α(n))', space: 'O(n)' },
};

// k 不相交路径（最大流法）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-flow-k-disjoint',
  categoryId: 'network',
  title: { zh: 'k 条边不相交路径（最大流法）', en: 'k Edge-Disjoint Paths (Max-Flow)' },
  summary: {
    zh: '用单位容量最大流求 s→t 的最多 k 条边不相交路径。',
    en: 'Use unit-capacity max-flow to find up to k edge-disjoint s→t paths.',
  },
  description: {
    zh: '把所有边容量设为 1，求 s→t 最大流。由最大流-最小割定理，最大流值即边不相交路径的最大条数；每条增广路对应一条边不相交路径。本实现用 BFS 增广（Edmonds-Karp），可在每次增广时记录路径。',
    en: 'Set every edge capacity to 1 and compute the s→t max-flow. By the max-flow min-cut theorem the value equals the maximum number of edge-disjoint paths; each augmenting path yields one such path. This implementation augments via BFS (Edmonds-Karp) and records each path as it is found.',
  },
  tags: ['network', 'max-flow', 'disjoint-path', 'edge-disjoint'],
  complexity: { time: 'O(k·(V + E))', space: 'O(V + E)' },
};

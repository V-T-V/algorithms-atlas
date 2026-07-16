// Kruskal Rollback · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kruskal-rollback',
  categoryId: 'graph',
  title: { zh: '可撤销 Kruskal', en: 'Kruskal with Rollback' },
  summary: {
    zh: '可撤销并查集 + Kruskal，支持回退合并操作。',
    en: 'Undoable union-find Kruskal supporting rollback of merges.',
  },
  description: {
    zh: '可撤销（rollback）并查集不做路径压缩（否则无法撤销），仅按秩合并，每次合并记录操作日志。可按栈序回退到之前的状态。常用于线段树分治、离线动态连通性等需要回退的场景。本实现用其跑一次 Kruskal 最小生成树，演示撤销能力。时间 O(E log E + E α(V))。',
    en: 'A rollback union-find skips path compression (which is not reversible), using union-by-rank only and logging each merge, so we can undo back to a previous state. Useful for segment-tree divide-and-conquer and offline dynamic connectivity. Here we run a Kruskal MST to showcase the undo capability. Time O(E log E + E α(V)).',
  },
  tags: ['graph', 'mst', 'kruskal', 'union-find', 'rollback', 'dsu'],
  complexity: { time: 'O(E log E)', space: 'O(V+E)' },
};

// Dijkstra Heap · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dijkstra-heap',
  categoryId: 'graph',
  title: { zh: 'Dijkstra·二叉堆优化', en: 'Dijkstra (Binary Heap)' },
  summary: {
    zh: '二叉堆优化的 Dijkstra 单源最短路（非负权）。',
    en: 'Binary-heap optimized Dijkstra single-source shortest path (non-negative weights).',
  },
  description: {
    zh: '用最小二叉堆维护「待松弛节点 + 当前已知最短距离」，每次取出距离最小的节点进行松弛。相比朴素 O(V²) 版本，在稀疏图上为 O((V+E) log V)。仅适用于非负权图。本实现提供标准 binary heap（数组实现，下标 1 起），支持 decrease-key（懒删除法：堆中可能存在过期条目，弹出时跳过）。',
    en: 'A min binary heap holds (candidate vertex, current best distance); each pop yields the closest vertex to relax. Versus naive O(V²), sparse graphs become O((V+E) log V). Non-negative weights only. Standard binary heap (1-indexed array) with lazy deletion of stale entries.',
  },
  tags: ['graph', 'shortest-path', 'dijkstra', 'heap', 'priority-queue'],
  complexity: { time: 'O((V+E) log V)', space: 'O(V+E)' },
};

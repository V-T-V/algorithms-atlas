// 树直径（双 BFS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-diameter-bfs',
  categoryId: 'tree',
  title: { zh: '树直径（双 BFS）', en: 'Tree Diameter (Double BFS)' },
  summary: {
    zh: '两次 BFS 求无权树直径：先到最远点 u，再从 u 到最远点 v。',
    en: 'Two BFS passes: reach the farthest node u, then from u reach v; the distance is the diameter.',
  },
  description: {
    zh:
      '树直径（双 BFS）：在一棵**无权（每条边权为 1）**的无根树上，直径 = 任意两节点间最远距离。' +
      '\n经典两次 BFS 算法：' +
      '\n1. 任选起点 s，BFS 找到距 s 最远的节点 u。' +
      '\n2. 从 u 再次 BFS，找到距 u 最远的节点 v。' +
      '\n3. `dist(u, v)` 即为直径。' +
      '\n正确性依赖树的性质：从任意点出发的最远点必为某条直径的端点。' +
      '\n时间 `O(V + E)`，空间 `O(V)`。输入以邻接表（节点 id 0..n−1）给出。',
    en:
      'Tree Diameter (double BFS): on an unweighted (unit-edge) unrooted tree, the diameter is the longest ' +
      'path between any two nodes. ' +
      '\nClassic two-BFS algorithm: ' +
      '\n1. Pick any node s; BFS to find u, the node farthest from s. ' +
      '\n2. BFS again from u to find v, the node farthest from u. ' +
      '\n3. dist(u, v) is the diameter. ' +
      '\nCorrectness rests on a tree property: the farthest node from any source is always a diameter endpoint. ' +
      'Time O(V + E), space O(V). Input is an adjacency list over node ids 0..n−1.',
  },
  tags: ['tree', 'graph', 'diameter', 'bfs', 'longest-path'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};

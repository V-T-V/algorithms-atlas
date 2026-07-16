import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bfs-layered',
  categoryId: 'graph',
  title: { zh: '分层 BFS', en: 'Layered BFS' },
  summary: {
    zh: '广度优先按层扩散，记录每一层顶点与距离。',
    en: 'Breadth-first expansion layer by layer, recording members and distance.',
  },
  description: {
    zh: '分层 BFS 从给定源点出发，逐层向外扩散：第 0 层是源点本身，第 k 层是距离源点恰为 k 的所有顶点。算法维护当前「前沿层」，对其中每个顶点的未访问邻居统一归入下一层。最终得到层数 = 最短距离，以及每层的成员列表。时间 O(V+E)。',
    en: 'Layered BFS expands outward from a source: layer 0 is the source itself, layer k contains all vertices at distance exactly k. The algorithm keeps a current frontier and moves all unvisited neighbors into the next layer, yielding distance = layer index and per-layer membership. Time O(V+E).',
  },
  tags: ['graph', 'bfs', 'traversal', 'shortest-path', 'unweighted'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};

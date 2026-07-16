import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-wall-and-gates',
  categoryId: 'graph',
  title: { zh: '墙与门', en: 'Walls and Gates' },
  summary: {
    zh: '多源 BFS：每个空房到最近门的距离。',
    en: 'Multi-source BFS: distance from each empty room to its nearest gate.',
  },
  description: {
    zh: 'LeetCode 286。m×n 房间：INF（2147483647）空房、-1 墙、0 门。给每个空房填上到最近门的距离，不可达保持 INF。把所有门同时入队做多源 BFS，按层扩展，每个空房首次被访问时填入当前层数即为最近距离。时间 O(mn)，空间 O(mn)。',
    en: 'LeetCode 286. m×n rooms: INF empty, -1 wall, 0 gate. Fill each empty room with its distance to the nearest gate (INF if unreachable). Enqueue all gates at once for multi-source BFS; the layer at which an empty room is first reached is its distance. Time O(mn), space O(mn).',
  },
  tags: ['bfs', 'multi-source', 'grid', 'leetcode'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};

// 跳跃游戏3 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-jump-game-3',
  categoryId: 'network',
  title: { zh: '跳跃游戏3', en: 'Jump Game III' },
  summary: {
    zh: '数组中从 start 出发，每次左/右跳 arr[i] 步，能否到达 0。',
    en: 'From start, jump ±arr[i]; can reach a 0?',
  },
  description: { zh: 'BFS/DFS。', en: 'BFS/DFS. O(n).' },
  tags: ['network', 'graph', 'bfs'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

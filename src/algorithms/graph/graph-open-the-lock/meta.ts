import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-open-the-lock',
  categoryId: 'graph',
  title: { zh: '打开转盘锁', en: 'Open the Lock' },
  summary: {
    zh: '从 0000 转 K 把避开死锁达到目标，求最少步数。',
    en: 'Turn a 4-wheel lock from 0000 to target avoiding deadends; find min turns.',
  },
  description: {
    zh: 'LeetCode 752。4 位转盘锁，每位 0-9 可前/后转一格。从 "0000" 开始，每次转一位一格，求转到 target 的最少步数；deadends 中的状态不可到达，若 0000 本身是死锁则 -1。BFS：以状态为节点、单次转动为边，首次到 target 即最短。时间 O(10⁴)，空间 O(10⁴)。',
    en: 'LeetCode 752. A 4-digit lock (each wheel 0-9, ±1 per turn) from "0000"; avoid deadends; find min turns to reach target (-1 if 0000 is dead). BFS over states with single-wheel turns as edges; first arrival is shortest. Time O(10⁴), space O(10⁴).',
  },
  tags: ['bfs', 'state-space', 'leetcode'],
  complexity: { time: 'O(10⁴)', space: 'O(10⁴)' },
};

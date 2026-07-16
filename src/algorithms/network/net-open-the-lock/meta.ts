// 打开转盘锁 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-open-the-lock',
  categoryId: 'network',
  title: { zh: '打开转盘锁', en: 'Open the Lock' },
  summary: {
    zh: '从 0000 转动到目标，避开 deadends 的最少步数。',
    en: 'Min turns from 0000 to target avoiding deadends.',
  },
  description: { zh: 'BFS，每步转动一个轮 +1/-1。', en: 'BFS each wheel ±1. O(10^4).' },
  tags: ['network', 'graph', 'bfs'],
  complexity: { time: 'O(10^4)', space: 'O(10^4)' },
};

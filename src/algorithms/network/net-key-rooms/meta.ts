// 钥匙与房间 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-key-rooms',
  categoryId: 'network',
  title: { zh: '钥匙与房间', en: 'Keys and Rooms' },
  summary: {
    zh: '从房间0出发用钥匙能否访问所有房间。',
    en: 'Can visit all rooms starting from room 0 with keys.',
  },
  description: { zh: 'BFS/DFS 模拟开锁。', en: 'BFS/DFS unlock. O(N*K).' },
  tags: ['network', 'graph', 'bfs'],
  complexity: { time: 'O(N*K)', space: 'O(N)' },
};

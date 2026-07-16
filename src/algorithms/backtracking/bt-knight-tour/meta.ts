// 骑士周游 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-knight-tour',
  categoryId: 'backtracking',
  title: { zh: '骑士周游', en: "Knight's Tour" },
  summary: {
    zh: '在 n×n 棋盘找骑士访问每格一次的路线。',
    en: 'Find a knight tour visiting every square once.',
  },
  description: { zh: '回溯，8 方向跳跃。', en: 'Backtrack 8 moves. O(8^(N*N)).' },
  tags: ['backtracking', 'knight'],
  complexity: { time: 'O(8^(N*N))', space: 'O(N*N)' },
};

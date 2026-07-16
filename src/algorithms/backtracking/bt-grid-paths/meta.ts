// 网格所有路径 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-grid-paths',
  categoryId: 'backtracking',
  title: { zh: '网格所有路径', en: 'All Grid Paths' },
  summary: {
    zh: '从左上到右下的所有只向右/下路径。',
    en: 'All right/down paths from top-left to bottom-right.',
  },
  description: { zh: '回溯选右或下。', en: 'Backtrack right/down. O(C(R+C, R)).' },
  tags: ['backtracking', 'grid'],
  complexity: { time: 'O(C(R+C, R))', space: 'O(R+C)' },
};

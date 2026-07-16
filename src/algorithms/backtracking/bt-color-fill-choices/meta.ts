// 多米诺骨牌铺法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-color-fill-choices',
  categoryId: 'backtracking',
  title: { zh: '多米诺骨牌铺法', en: 'Domino Tiling Count' },
  summary: {
    zh: '回溯求 2×n 网格用 1×2 多米诺铺满的方法数。',
    en: 'Count ways to tile 2xn grid with 1x2 dominoes.',
  },
  description: { zh: '逐列回溯，状态为上格是否填。', en: 'Column-by-column backtrack. O(2^n).' },
  tags: ['backtracking', 'tiling'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};

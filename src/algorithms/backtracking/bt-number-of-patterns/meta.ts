// 解锁模式数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-number-of-patterns',
  categoryId: 'backtracking',
  title: { zh: '解锁模式数', en: 'Number of Unlock Patterns' },
  summary: {
    zh: '回溯统计 Android 解锁图案中长度在 [m,n] 范围的模式总数。',
    en: 'Backtracking to count Android unlock patterns with length in [m,n].',
  },
  description: {
    zh: '3×3 九宫格，连接点成图案。若两点间存在未访问的中间点则不能直接相连。利用对称性加速。',
    en: 'Connect dots on a 3×3 grid. Two points cannot be connected directly if an unvisited midpoint lies between them. Symmetry accelerates counting.',
  },
  tags: ['backtracking', 'grid'],
  complexity: { time: 'O(9!)', space: 'O(9)' },
};

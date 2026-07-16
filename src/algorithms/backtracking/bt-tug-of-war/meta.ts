// 拔河最小差 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-tug-of-war',
  categoryId: 'backtracking',
  title: { zh: '拔河最小差', en: 'Tug of War' },
  summary: {
    zh: '把数组分成大小相差不超过 1 的两子集，使和差最小。',
    en: 'Split into two nearly-equal subsets with min sum difference.',
  },
  description: { zh: '回溯选 n/2 个到一队。', en: 'Backtrack n/2 elements. O(C(n, n/2)).' },
  tags: ['backtracking', 'partition'],
  complexity: { time: 'O(C(n, n/2))', space: 'O(n)' },
};

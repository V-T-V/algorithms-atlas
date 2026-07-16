// Android 解锁模式枚举 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-android-unlock',
  categoryId: 'backtracking',
  title: { zh: 'Android 解锁模式枚举', en: 'Android Unlock Patterns (Enumerate)' },
  summary: {
    zh: '回溯枚举给定长度的所有合法 Android 九宫格解锁序列。',
    en: 'Backtracking to enumerate all valid Android grid unlock patterns of a given length.',
  },
  description: {
    zh: '3×3 九宫格，连接点成图案。若两点间存在未访问的中间点则不能直接相连。本算法列出所有具体序列。',
    en: 'Connect dots on a 3×3 grid. Two points cannot connect directly if an unvisited midpoint lies between them. This variant lists concrete sequences.',
  },
  tags: ['backtracking', 'grid', 'enumeration'],
  complexity: { time: 'O(9!)', space: 'O(9)' },
};

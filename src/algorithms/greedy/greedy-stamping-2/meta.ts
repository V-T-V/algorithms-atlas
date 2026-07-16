// 戳印序列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-stamping-2',
  categoryId: 'greedy',
  title: { zh: '戳印序列', en: 'Stamping The Sequence' },
  summary: {
    zh: '用固定印章把空白字符串盖成目标；反向贪心找可盖窗口。',
    en: 'Stamp a blank string into target with a fixed stamp; greedily find stampable windows in reverse.',
  },
  description: {
    zh: 'LeetCode 936 戳印序列：印章 stamp、目标 target，每次用印章覆盖一段（已是目标字符的不变）。求正向覆盖顺序，等价于反向剥除。',
    en: 'LeetCode 936 Stamping The Sequence: stamp and target; each stamp covers a window (matched chars stay). Find forward order via reverse peeling.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n·m)', space: 'O(n)' },
};

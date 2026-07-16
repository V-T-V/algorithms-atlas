// 火柴拼正方形 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-matchsticks-square',
  categoryId: 'backtracking',
  title: { zh: '火柴拼正方形', en: 'Matchsticks to Square' },
  summary: {
    zh: '判断能否用所有火柴拼成正方形（4 边相等）。',
    en: 'Can form a square using all matchsticks.',
  },
  description: {
    zh: '总和须被 4 整除，回溯放每条边。',
    en: 'Sum divisible by 4, backtrack sides. O(4^n).',
  },
  tags: ['backtracking', 'partition'],
  complexity: { time: 'O(4^n)', space: 'O(n)' },
};

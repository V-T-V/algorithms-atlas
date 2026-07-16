// 瓷砖可能性 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-tiles-possibilities',
  categoryId: 'backtracking',
  title: { zh: '瓷砖可能性', en: 'Letter Tile Possibilities' },
  summary: {
    zh: '回溯统计用瓷砖字母能组成的所有非空序列数。',
    en: 'Backtracking to count all non-empty sequences buildable from letter tiles.',
  },
  description: {
    zh: '每个字母瓷砖用一次。用频数表回溯：每步选一个仍有剩余的字母，计入序列。',
    en: 'Each letter tile used once. Backtrack with a frequency table: at each step pick any letter with remaining count and accumulate sequences.',
  },
  tags: ['backtracking', 'counting'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
};

// 单词模式匹配 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-template-match',
  categoryId: 'backtracking',
  title: { zh: '单词模式匹配', en: 'Word Pattern Matching' },
  summary: { zh: '判断字符串能否按模式匹配（双射）。', en: 'Match string to pattern (bijection).' },
  description: {
    zh: '回溯分配 模式字符→子串。',
    en: 'Backtrack char-to-substring mapping. O(n^m).',
  },
  tags: ['backtracking', 'pattern'],
  complexity: { time: 'O(n^m)', space: 'O(m)' },
};

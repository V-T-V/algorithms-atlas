// 单词搜索 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-word-search',
  categoryId: 'backtracking',
  title: { zh: '单词搜索', en: 'Word Search' },
  summary: {
    zh: '在字符网格中找是否存在给定单词（四向相邻）。',
    en: 'Find if word exists in char grid (4-dir adjacent).',
  },
  description: {
    zh: 'DFS 回溯，标记已访问。',
    en: 'DFS backtrack with visited marking. O(N*M*4^L).',
  },
  tags: ['backtracking', 'grid', 'dfs'],
  complexity: { time: 'O(N*M*4^L)', space: 'O(L)' },
};

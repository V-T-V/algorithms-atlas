// 单词接龙 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-word-ladder',
  categoryId: 'network',
  title: { zh: '单词接龙', en: 'Word Ladder' },
  summary: {
    zh: 'BFS 找 beginWord 到 endWord 最短转换序列长度（每次改一个字母）。',
    en: 'Shortest transformation length changing one letter per step.',
  },
  description: {
    zh: 'BFS：对当前词每个位置尝试 a-z。',
    en: 'BFS, try a-z at each position. O(N*L*26).',
  },
  tags: ['network', 'graph', 'bfs'],
  complexity: { time: 'O(N*L)', space: 'O(N)' },
};

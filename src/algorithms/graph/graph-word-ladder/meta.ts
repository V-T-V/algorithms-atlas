import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-word-ladder',
  categoryId: 'graph',
  title: { zh: '单词接龙', en: 'Word Ladder' },
  summary: {
    zh: '单源 BFS：每次改一个字母在词典中前进，求最短步数。',
    en: 'Single-source BFS changing one letter per step through the dictionary; min steps.',
  },
  description: {
    zh: 'LeetCode 127。起点 beginWord、终点 endWord、词典 wordList，每步把当前词改一个字母得到的新词必须在词典中，求 beginWord→endWord 的最短变换序列长度（含两端）；不可达返回 0。单源 BFS：从 beginWord 出发按层扩展所有「差一字母」的词典词，首次到 endWord 即最短。时间 O(L²·N)，空间 O(N)。',
    en: 'LeetCode 127. Change one letter per step through dictionary words from beginWord to endWord; return sequence length (0 if impossible). Single-source BFS; first arrival at endWord is shortest. Time O(L²·N), space O(N).',
  },
  tags: ['bfs', 'string', 'shortest-path', 'leetcode'],
  complexity: { time: 'O(L²·N)', space: 'O(N)' },
};

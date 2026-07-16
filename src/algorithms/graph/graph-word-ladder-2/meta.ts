import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-word-ladder-2',
  categoryId: 'graph',
  title: { zh: '单词接龙 II（所有最短）', en: 'Word Ladder II (All Shortest)' },
  summary: {
    zh: 'BFS + 回溯，求从 beginWord 到 endWord 的所有最短转换序列。',
    en: 'BFS plus backtracking to list all shortest transformation sequences.',
  },
  description: {
    zh: 'LeetCode 126。字典 wordList 中，每次只改一个字母，相邻词须都在字典中。求从 beginWord 到 endWord 的所有「最短」转换序列。BFS 分层记录每个词的前驱；到达 endWord 后回溯所有最短路径。时间 O(N²·L)（N=词数，L=词长），空间 O(N²)。',
    en: 'LeetCode 126. Change one letter per step; all words must be in dict. BFS by levels tracking predecessors; backtrack to enumerate all shortest paths. Time O(N²·L), space O(N²).',
  },
  tags: ['graph', 'bfs', 'backtracking', 'string', 'leetcode'],
  complexity: { time: 'O(N²·L)', space: 'O(N²)' },
};

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-string-transform',
  categoryId: 'graph',
  title: { zh: '字符串变换（双向 BFS）', en: 'String Transform (Bi-BFS)' },
  summary: {
    zh: '每次改一个字符把起点串变终点串，中途必须在词典中，求最短步数。',
    en: 'Change one char per step to morph start into end through dictionary words; min steps.',
  },
  description: {
    zh: 'LeetCode 127（双向 BFS 版）。起点 beginWord、终点 endWord、词典 wordList。每步把当前词改一个字母得到的新词必须在词典中，求 beginWord→endWord 的最短变换序列长度（含两端）；不可达返回 0。双向 BFS：同时从 beginWord 和 endWord 扩展，当两边相遇即得最短。时间 O(L²·N)，空间 O(N)。',
    en: 'LeetCode 127 (bi-BFS). Change one letter per step through dictionary words from beginWord to endWord; return sequence length (0 if impossible). Bi-BFS expands from both ends; meeting point gives the shortest. Time O(L²·N), space O(N).',
  },
  tags: ['bfs', 'bidirectional', 'string', 'leetcode'],
  complexity: { time: 'O(L²·N)', space: 'O(N)' },
};

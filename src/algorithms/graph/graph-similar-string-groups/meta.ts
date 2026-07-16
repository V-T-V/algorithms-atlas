import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-similar-string-groups',
  categoryId: 'graph',
  title: { zh: '相似字符串组', en: 'Similar String Groups' },
  summary: {
    zh: '两串最多差 2 个字符算相似，求相似连通分量数。',
    en: 'Strings differing in at most 2 positions are similar; count connected components.',
  },
  description: {
    zh: 'LeetCode 839。两字符串若可通过交换两个字符位置（或完全相同）变为相等则「相似」（等价于最多两个位置字符不同）。给定等长的字符串数组，求相似关系的连通分量数（每个分量内串两两可达）。并查集：对所有串两两判定相似，相似则 union；最终分量数 = 初始 n - 成功合并次数。时间 O(n²·L)，空间 O(n)。',
    en: 'LeetCode 839. Two strings are similar if they differ in at most 2 positions (or are identical). Count connected components of the similarity relation. Union-Find over all pairs: union similar pairs; components = n - successful unions. Time O(n²·L), space O(n).',
  },
  tags: ['union-find', 'graph', 'string', 'leetcode'],
  complexity: { time: 'O(n²·L)', space: 'O(n)' },
};

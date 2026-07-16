import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-alien-dictionary',
  categoryId: 'graph',
  title: { zh: '外星人词典', en: 'Alien Dictionary' },
  summary: {
    zh: '由词典中词的相对顺序推出字母的拓扑序。',
    en: 'Infer the topological order of alien letters from a sorted word list.',
  },
  description: {
    zh: 'LeetCode 269。给定按外星字典序排列的单词列表 words，推出该外星字母表中字母的出现顺序（任一合法序）。对比相邻两词首个不同字母得到一条 c1→c2 的边；对字母做拓扑排序得到顺序。若存在环（如 a→b 且 b→a，或前缀异常如 ab 在 a 之前）返回空串。时间 O(C)（C 为所有字符总数），空间 O(字母数)。',
    en: 'LeetCode 269. Given words sorted in an alien order, infer a valid letter order. Compare adjacent words: the first differing pair gives an edge c1→c2; topological sort yields the order. Return "" if cyclic or invalid prefix. Time O(C) (C total chars), space O(alphabet).',
  },
  tags: ['topological-sort', 'graph', 'leetcode'],
  complexity: { time: 'O(C)', space: 'O(|Σ|)' },
};

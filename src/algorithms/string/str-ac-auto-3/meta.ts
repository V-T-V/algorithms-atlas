import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-ac-auto-3',
  categoryId: 'string',
  title: { zh: 'AC 自动机', en: 'Aho-Corasick Automaton' },
  summary: {
    zh: 'Trie + KMP 失败指针，在文本中同时匹配多模式。',
    en: 'Trie + KMP failure links; matches multiple patterns in a text simultaneously.',
  },
  description: {
    zh: '把模式串插入 Trie，BFS 构建 fail 指针，扫描文本一次得到所有匹配。',
    en: 'Insert patterns into a trie, BFS to build fail links, then scan text once for all matches.',
  },
  tags: ['string', 'ac-automaton', 'trie', 'multi-pattern'],
  complexity: { time: 'O(n + m)', space: 'O(总模式长度)' },
};

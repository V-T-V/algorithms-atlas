import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-aho-3',
  categoryId: 'string',
  title: {
    zh: 'Aho-Corasick（字典图 / 自动机完整转移）',
    en: 'Aho-Corasick (Full DFA Transitions)',
  },
  summary: {
    zh: '在 fail 链基础上预构完整转移图，O(n) 扫描文本多模式匹配。',
    en: 'Pre-builds a complete transition graph on top of fail links; O(n) text scan for multi-pattern.',
  },
  description: {
    zh: 'BFS 时把每个节点缺失的转移指向 fail 链上对应转移，形成自动机。',
    en: 'During BFS, missing transitions are pointed to the corresponding fail-chain transitions, yielding a DFA.',
  },
  tags: ['string', 'aho-corasick', 'dfa', 'multi-pattern'],
  complexity: { time: 'O(n + m)', space: 'O(总模式长度)' },
};

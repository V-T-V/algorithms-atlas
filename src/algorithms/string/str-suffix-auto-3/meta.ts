import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-suffix-auto-3',
  categoryId: 'string',
  title: { zh: '后缀自动机（SAM）', en: 'Suffix Automaton (SAM)' },
  summary: {
    zh: '识别所有后缀的最小 DFA，O(n) 在线构造。',
    en: 'Minimal DFA accepting all suffixes; constructed online in O(n).',
  },
  description: {
    zh: '通过 last 与 link 树增量扩展。每个状态代表一组 endpos 等价类。',
    en: 'Incrementally extended via last + link tree; each state represents an endpos-equivalence class.',
  },
  tags: ['string', 'sam', 'automaton'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

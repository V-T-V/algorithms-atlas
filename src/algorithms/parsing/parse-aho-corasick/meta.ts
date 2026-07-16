import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-aho-corasick',
  categoryId: 'parsing',
  title: { zh: 'Aho-Corasick', en: 'Aho-Corasick Multi-Pattern' },
  summary: {
    zh: '构造 AC 自动机，一次扫描文本同时匹配多模式。',
    en: 'Build an automaton to scan text once and match many patterns simultaneously.',
  },
  description: {
    zh: 'Trie + 失败指针（最长真后缀链）。匹配失败时沿失败链回退，避免重新扫描。',
    en: 'Trie plus failure links; on mismatch, follow failure links instead of rescanning.',
  },
  tags: ['parsing', 'automaton', 'multi-pattern'],
  complexity: { time: 'O(n+m+z)', space: 'O(m)' },
};

// AC 自动机 fail 指针构建 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ac-automaton-build',
  categoryId: 'string',
  title: { zh: 'AC 自动机 fail 指针构建（BFS）', en: 'AC Automaton Fail-Link Construction (BFS)' },
  summary: {
    zh: '在 trie 上 BFS 构建 fail 指针，得到 AC 自动机的转移结构。',
    en: 'Build fail links over a trie via BFS to obtain the AC automaton transition structure.',
  },
  description: {
    zh: 'AC 自动机的关键步骤是把一组模式串建成 trie 后，用 BFS 逐层计算每个节点的 fail 指针（指向本节点代表串的最长真后缀对应节点）。本实现聚焦构建阶段：建 trie + BFS 求 fail，并把每个节点的子转移规约为 goto 自动机（缺失转移回填为 fail 路径），便于后续 O(|text|) 匹配。区别于已有的 ac-automaton（含完整扫描与位置报告），本算法聚焦 fail 链构建。',
    en: 'The core step of AC automaton: after building a trie of patterns, BFS computes each node fail link (pointing to the node of the longest proper suffix). This implementation focuses on the build phase: trie + BFS fail + goto machine (fill missing transitions along fail paths), enabling O(|text|) matching later. Distinct from the existing ac-automaton (full scan with positions), this focuses on fail-link construction.',
  },
  tags: ['string', 'ac-automaton', 'trie', 'fail-link', 'aho-corasick'],
  complexity: { time: 'O(sum |patterns|)', space: 'O(sum |patterns|)' },
};

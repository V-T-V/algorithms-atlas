// 正则等价判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-regex-equivalent',
  categoryId: 'parsing',
  title: { zh: 'DFA/正则等价判定', en: 'DFA/Regex Equivalence' },
  summary: {
    zh: '用叉积 DFA + DFS 检查两个自动机是否语言相同。',
    en: 'Build the product automaton and DFS to check two DFAs accept the same language.',
  },
  description: {
    zh: '判定两个正则/dfa 是否等价（接受同一语言）可机械求解。经典方法：构造叉积 DFA，状态是 (p,q) 一对，按 (A 接受 而 B 不接受) 或反之 区分。若从 (startA,startB) 出发可达一个「恰好一方接受」的状态，则两语言不同（可给出反例串）；否则等价。本实现用 BFS 在叉积上搜索，既给出布尔结论，也给出反例（最短区分串）。注意两自动机字母表需先取并集，缺边按「陷阱状态」处理。',
    en: 'Whether two regular expressions / DFAs are equivalent (same language) is decidable. Classical method: construct the product DFA whose states are pairs (p,q), and mark states where exactly one of A/B accepts. If such a state is reachable from (startA,startB), the languages differ (and we can return the shortest distinguishing string); otherwise they are equivalent. We BFS the product, returning both the verdict and a counterexample. Alphabet is the union of both; missing edges are treated as a trap state.',
  },
  tags: ['parsing', 'regex', 'dfa', 'equivalence', 'automata'],
  complexity: { time: 'O(n·m)', space: 'O(n·m)' },
};

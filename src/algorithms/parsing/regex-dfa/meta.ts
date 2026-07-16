// Regex → DFA (Subset Construction) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'regex-dfa',
  categoryId: 'parsing',
  title: { zh: 'NFA→DFA 子集构造法', en: 'NFA → DFA (Subset Construction)' },
  summary: {
    zh: '把 ε-NFA 的状态集合作为 DFA 单一状态，子集构造 + ε-闭包消去非确定性。',
    en: 'Treat each set of ε-NFA states as a single DFA state; subset construction plus ε-closure removes nondeterminism.',
  },
  description: {
    zh: '子集构造法（subset construction）把一个 ε-NFA 转换为等价的 DFA。核心思想：DFA 的每个状态是 NFA 状态的一个子集。算法从初始状态集 ε-closure({start}) 出发，对每个输入符号 a 求 move(T, a)（T 中所有经 a 转移到达的 NFA 状态），再取其 ε-闭包作为新的 DFA 状态；重复直到不再产生新子集。包含 NFA 接受状态的子集成为 DFA 接受状态。这样 DFA 的转移是确定性的（每状态每符号最多一条边），匹配可 O(n) 单遍扫描。本实现先构造小型 ε-NFA，再做子集构造。',
    en: 'Subset construction converts an ε-NFA into an equivalent DFA. The core idea: each DFA state is a set of NFA states. Starting from the ε-closure of the start set, for each input symbol a we compute move(T, a) (the NFA states reachable from T via a single a-transition), then take its ε-closure as a new DFA state; we repeat until no new subset appears. A subset containing an NFA accept state becomes a DFA accept state. The resulting DFA has deterministic transitions (at most one edge per state and symbol), so matching scans the input once in O(n). This implementation first builds a small ε-NFA, then performs subset construction.',
  },
  tags: ['parsing', 'regex', 'automata', 'nfa', 'dfa', 'subset-construction'],
  complexity: { time: 'O(2^|Q|·|Σ|)', space: 'O(2^|Q|)' },
};

// DFA 最小化 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-regex-minimize',
  categoryId: 'parsing',
  title: { zh: 'DFA 最小化（Moore）', en: 'DFA Minimization (Moore)' },
  summary: {
    zh: '用 Moore 划分迭代法把 DFA 合并等价状态到最少。',
    en: 'Iteratively partition DFA states with Moore algorithm to collapse equivalent states.',
  },
  description: {
    zh: '两个 DFA 状态等价，当且仅当从它们出发，对任意输入串要么都接受要么都拒绝。Moore 算法用划分细化（partition refinement）求解：初始把状态分成「接受」与「非接受」两组；每轮检查每个组内状态在所有字符上的转移是否落到同一组，若不同则继续细化；重复直到划分不再改变。最终每个组里的状态互相等价，可合并为一个。最小 DFA 同构唯一。复杂度 O(n²)（Hopcroft 可达 O(n log n)）。本实现输入一个显式 DFA（状态表），输出最小化后的 DFA。',
    en: 'Two DFA states are equivalent iff for every input string they either both accept or both reject. Moore algorithm uses partition refinement: start by splitting states into accepting vs non-accepting; each round, split any group whose states transition into different groups on some symbol; repeat until stable. States sharing a final group are equivalent and can be merged. The minimal DFA is unique up to isomorphism. Complexity O(n²) (Hopcroft achieves O(n log n)). This implementation takes an explicit DFA (state table) and returns the minimized DFA.',
  },
  tags: ['parsing', 'regex', 'dfa', 'minimization', 'automata'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};

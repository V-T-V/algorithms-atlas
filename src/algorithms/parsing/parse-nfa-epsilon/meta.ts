import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-nfa-epsilon',
  categoryId: 'parsing',
  title: { zh: 'ε-NFA', en: 'NFA with epsilon-transitions' },
  summary: {
    zh: '允许 ε 转移的非确定有限自动机，用 ε-闭包 + 子集构造跑输入。',
    en: 'Nondeterministic finite automaton with epsilon-moves, run via epsilon-closure.',
  },
  description: {
    zh: '每步维护一个状态集合；读符号前做 ε-闭包扩展，读符号后转移再求闭包。',
    en: 'Track a set of states; take epsilon-closure before each symbol, then transition and close again.',
  },
  tags: ['parsing', 'automaton', 'nfa', 'epsilon'],
  complexity: { time: 'O(n*|Q|^2)', space: 'O(|Q|)' },
};

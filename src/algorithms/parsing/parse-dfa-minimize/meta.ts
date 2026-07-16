import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-dfa-minimize',
  categoryId: 'parsing',
  title: { zh: 'DFA 最小化', en: 'DFA Minimization (Hopcroft)' },
  summary: {
    zh: 'Hopcroft 算法把 DFA 划分到等价类，得到状态数最少的等价 DFA。',
    en: 'Partition a DFA into equivalence classes to get the minimal equivalent DFA.',
  },
  description: {
    zh: '反复细化状态划分：若同类状态对某输入落到不同类则拆分。结束时每类合成一个状态。',
    en: 'Refine the partition by splitting classes whose members transition to different classes on the same symbol.',
  },
  tags: ['parsing', 'automaton', 'dfa', 'partition'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

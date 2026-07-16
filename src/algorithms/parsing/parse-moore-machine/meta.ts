import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-moore-machine',
  categoryId: 'parsing',
  title: { zh: 'Moore 机', en: 'Moore Machine' },
  summary: {
    zh: '输出依附于状态的有限状态机。',
    en: 'FSM whose output is a function of state only.',
  },
  description: {
    zh: 'Moore: 每状态 q 有输出 λ(q)。输出比 Mealy 慢一拍但与输入无关。',
    en: 'Moore: each state has an output lambda(q); output lags one step but is independent of input.',
  },
  tags: ['parsing', 'automaton', 'fsm'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

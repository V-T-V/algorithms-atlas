import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-mealy-machine',
  categoryId: 'parsing',
  title: { zh: 'Mealy 机', en: 'Mealy Machine' },
  summary: {
    zh: '输出依附于转移的有限状态机。',
    en: 'FSM whose output depends on the current transition, not the state.',
  },
  description: {
    zh: 'Mealy: 每条转移 (q -a-> q′) 产生输出。比 Moore 状态少，输出与输入绑定。',
    en: 'Mealy outputs are attached to transitions; fewer states than Moore, output tied to input.',
  },
  tags: ['parsing', 'automaton', 'fsm'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

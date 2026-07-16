// 带下界最大流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-flow-with-demands',
  categoryId: 'network',
  title: { zh: '带下界最大流', en: 'Max Flow with Lower Bounds' },
  summary: {
    zh: '在每条边带流量下界的源汇网络中求满足下界约束的最大流。',
    en: 'Find a maximum source-sink flow when every edge has a lower-bound requirement.',
  },
  description: {
    zh: '带下界最大流：边约束 l(e)≤f(e)≤c(e)，求 s→t 的最大流。两步法：(1) 加边 t→s 容量 ∞，把问题转为带下界环流可行性（见 net-circulation-feasible）；若不可行则原问题无解。(2) 若可行，在满足下界的初始环流基础上，沿残量图从 s 到 t 继续增广，得到最大流。',
    en: 'Max flow with lower bounds: edges satisfy l(e)≤f(e)≤c(e); maximize s->t flow. Two steps: (1) add edge t->s of infinite capacity, reducing to lower-bounded circulation feasibility (see net-circulation-feasible); infeasible circulation means no solution. (2) If feasible, continue augmenting from s to t on the residual graph of the satisfying circulation to obtain the maximum flow.',
  },
  tags: ['network', 'max-flow', 'lower-bound', 'demands', 'reduction'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
};

// 带需求环流可行性 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-circulation-feasible',
  categoryId: 'network',
  title: { zh: '环流可行性 (Circulation Feasibility)', en: 'Circulation Feasibility' },
  summary: {
    zh: '判定每条边带流量下界 l(e) 与上界 c(e) 的网络是否存在满足容量与守恒的环流。',
    en: 'Decide whether a network with per-edge lower bounds l(e) and upper bounds c(e) admits a circulation satisfying capacity and conservation.',
  },
  description: {
    zh: '环流可行性：无源无汇，每个节点流入=流出，且 l(e)≤f(e)≤c(e)。归约：令 f′(e)=f(e)−l(e)，边容量变为 c′=c−l；每个节点 v 的不平衡 d(v)=Σ_in l − Σ_out l。加超级源 S*、超级汇 T*：d(v)>0 加边 S*→v 容量 d(v)；d(v)<0 加边 v→T* 容量 −d(v)。若 S*→T* 最大流等于所有正 d 之和则可行。',
    en: 'Circulation feasibility: no source/sink; every node conserves flow with l(e)≤f(e)≤c(e). Reduction: set f′(e)=f(e)−l(e), capacity c′=c−l; each node v has imbalance d(v)=Σ_in l − Σ_out l. Add super-source S* and super-sink T*: for d(v)>0 add S*->v of capacity d(v); for d(v)<0 add v->T* of capacity −d(v). Feasible iff the S*->T* max flow equals the sum of all positive d(v).',
  },
  tags: ['network', 'circulation', 'lower-bound', 'feasibility', 'reduction'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
};

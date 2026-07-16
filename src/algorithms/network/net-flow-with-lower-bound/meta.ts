// 带下界的最大流 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-flow-with-lower-bound',
  categoryId: 'network',
  title: { zh: '带下界约束的最大流', en: 'Max-Flow with Lower Bounds' },
  summary: {
    zh: '每条边除上界外还有下界：先构造满足下界的可行流，再在残量图上继续增广求最大流。',
    en: 'Each edge has both a lower and upper bound: first build a feasible flow satisfying the lower bounds, then keep augmenting on the residual graph for max flow.',
  },
  description: {
    zh: '带下界的最大流问题：每条边要求流量 ∈ [low, cap]。解法（超级源汇法）：把每条边 (u,v,low,cap) 拆为 (u,v,low,cap-low) 的容量边，并把「下界义务」u→v 的 low 流量转为：源 s 给 u 供 low、v 给汇 t 排 low；再引入超级源 SS 与超级汇 TT，对不平衡的点连补偿边。先在 SS→TT 上求最大流判定可行，可行后再在原图残量上从 s 到 t 继续增广。',
    en: 'Max-flow with lower bounds: each edge flow must lie in [low, cap]. Solution (super-source/sink): split each edge (u,v,low,cap) into a (u,v,low,cap-low) edge and route the lower-bound obligation via a super-source SS feeding u and v feeding super-sink TT, with compensation edges for imbalanced nodes. First decide feasibility by max-flow on SS→TT; if feasible, keep augmenting s→t on the original residual graph.',
  },
  tags: ['network', 'max-flow', 'lower-bound', 'feasibility'],
  complexity: { time: 'O(V²·E)', space: 'O(V + E)' },
};

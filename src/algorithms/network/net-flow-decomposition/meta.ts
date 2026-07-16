// 流分解 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-flow-decomposition',
  categoryId: 'network',
  title: { zh: '流分解 (Flow Decomposition)', en: 'Flow Decomposition' },
  summary: {
    zh: '将任意 s-t 流唯一分解为若干源汇路径流与若干环流之和。',
    en: 'Uniquely decompose any s-t flow into a sum of source-to-sink path flows plus circulation cycles.',
  },
  description: {
    zh: '流分解定理：任意可行流 f 可写成 f = Σ_i p_i·P_i + Σ_j c_j·C_j，其中 P_i 是 s→t 简单路径，C_j 是简单环，系数非负。算法：反复从源沿正流边 DFS 到汇取出一条路径（瓶颈为该路径流量），剩余图若含环则取出；总路径数 ≤ E，环数 ≤ E。',
    en: 'Flow decomposition theorem: any feasible flow f = Σ_i p_i·P_i + Σ_j c_j·C_j where P_i are simple s->t paths, C_j are simple cycles, and coefficients are non-negative. Algorithm: repeatedly DFS from source along positive-flow edges to the sink to extract a path (bottleneck = path flow); then extract any remaining cycles. Total paths <= E, cycles <= E.',
  },
  tags: ['network', 'flow', 'decomposition', 'paths', 'cycles'],
  complexity: { time: 'O(V·E)', space: 'O(V + E)' },
};

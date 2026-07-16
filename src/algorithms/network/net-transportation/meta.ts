// 运输问题 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-transportation',
  categoryId: 'network',
  title: { zh: '运输问题', en: 'Transportation Problem' },
  summary: {
    zh: '在供应点与需求点间以单位运费矩阵求最小总运费的运输方案。',
    en: 'Find a minimum-cost shipping plan between supply and demand nodes given a unit-cost matrix.',
  },
  description: {
    zh: '运输问题：m 个供应点各有供应量 a_i，n 个需求点各有需求量 b_j，从 i 到 j 单位运费 C[i][j]。求总运费最小的运输量 x[i][j]≥0，满足行供应上限、列需求恰好。归约为最小费用流：超级源连供应点（容量 a_i，费 0），供应点连需求点（容量 ∞，费 C[i][j]），需求点连超级汇（容量 b_j，费 0）。',
    en: 'Transportation problem: m supply nodes with amounts a_i, n demand nodes with demands b_j, unit cost C[i][j]. Find x[i][j]>=0 minimizing total cost subject to row supply caps and column demand. Reduce to min-cost flow: super-source to supply (cap a_i, cost 0), supply to demand (cap infinity, cost C[i][j]), demand to super-sink (cap b_j, cost 0).',
  },
  tags: ['network', 'transportation', 'min-cost-flow', 'supply-demand', 'lp'],
  complexity: { time: 'O(V·E²·log V)', space: 'O(V + E)' },
};

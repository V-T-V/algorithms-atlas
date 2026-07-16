// 转运问题 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-transshipment',
  categoryId: 'network',
  title: { zh: '转运问题', en: 'Transshipment Problem' },
  summary: {
    zh: '允许中间节点既收又发的最小费用流：供应点经转运点送达需求点。',
    en: 'A min-cost flow allowing intermediate nodes to both receive and forward: supply reaches demand via transshipment nodes.',
  },
  description: {
    zh: '转运问题：除供应点（净产出）与需求点（净吸入）外，还有转运点（净流量 0，可中转）。每条边有容量与单位运费。归约为标准最小费用流：节点净需求 b(v)（供应>0、需求<0、转运=0），加超级源汇处理不平衡，求满足容量与净需求的最小费用流。',
    en: 'Transshipment problem: besides supply nodes (net producers) and demand nodes (net consumers), there are transshipment nodes (net zero, pure relays). Each edge has a capacity and unit cost. Reduce to standard min-cost flow: assign net demand b(v) (supply>0, demand<0, transshipment=0), add a super-source/sink to absorb imbalance, and solve the min-cost flow satisfying capacities and net demands.',
  },
  tags: ['network', 'transshipment', 'min-cost-flow', 'intermediate-nodes'],
  complexity: { time: 'O(V·E²·log V)', space: 'O(V + E)' },
};

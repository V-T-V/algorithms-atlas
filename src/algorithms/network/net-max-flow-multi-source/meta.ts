// 多源最大流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-max-flow-multi-source',
  categoryId: 'network',
  title: { zh: '多源最大流', en: 'Multi-Source Max Flow' },
  summary: {
    zh: '引入超级源点连接所有源点，将多源最大流归约为单源单汇最大流。',
    en: 'Reduce multi-source max flow to single-source single-sink by adding a super-source connected to every source.',
  },
  description: {
    zh: '多源最大流问题：多个源点各自有供应量，求到汇点的最大流。构造超级源 S*，对每个源点 si 加边 S*→si，容量为 si 的供应（或 ∞）。在 S* 到汇上跑标准最大流即可。',
    en: "Multi-source max flow: multiple sources each with supply; find the maximum flow to the sink. Add a super-source S* with edges S*->si of capacity equal to si's supply (or infinity), then run standard max flow from S* to the sink.",
  },
  tags: ['network', 'max-flow', 'multi-source', 'super-source', 'reduction'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
};

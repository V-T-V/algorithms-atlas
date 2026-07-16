// 多汇最大流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-max-flow-multi-sink',
  categoryId: 'network',
  title: { zh: '多汇最大流', en: 'Multi-Sink Max Flow' },
  summary: {
    zh: '引入超级汇点连接所有汇点，将多汇最大流归约为单源单汇最大流。',
    en: 'Reduce multi-sink max flow to single-source single-sink by adding a super-sink connected from every sink.',
  },
  description: {
    zh: '多汇最大流问题：单个源点到多个汇点（各有需求）的最大流。构造超级汇 T*，对每个汇点 ti 加边 ti→T*，容量为 ti 的需求（或 ∞）。跑标准最大流即可。',
    en: "Multi-sink max flow: a single source flows to multiple sinks each with demand. Add a super-sink T* with edges ti->T* of capacity equal to ti's demand (or infinity), then run standard max flow.",
  },
  tags: ['network', 'max-flow', 'multi-sink', 'super-sink', 'reduction'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
};

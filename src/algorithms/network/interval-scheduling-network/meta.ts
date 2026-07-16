// 区间调度转网络流（Interval Scheduling via Max Flow）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'interval-scheduling-network',
  categoryId: 'network',
  title: { zh: '区间调度转网络流', en: 'Interval Scheduling via Max Flow' },
  summary: {
    zh: '把「在每时刻最多选 k 个不冲突区间」的最大选择问题建模为最大流。',
    en: 'Model "select max non-conflicting intervals with at most k per time" as a max-flow problem.',
  },
  description: {
    zh: '区间调度问题：给定 n 个区间 [s_i, e_i) 与机器数 k，求最多能选择多少个区间，使得任一时刻所选区间数 ≤ k。\n\n**最大流建模**：\n1. 把所有端点排序去重，得到时间点 t_0 < t_1 < ... < t_m。\n2. 构造「链式图」：每个时间点是一个节点，相邻时间点连一条容量 = k 的边（表示该段时间最多容纳 k 个区间）。\n3. 对每个区间 [s_i, e_i)：从其起点时间点到终点时间点连一条容量 = 1 的边（选择该区间 = 在链上「抄近路」）。\n4. 添加源 s 连到 t_0、t_m 连到汇 T，容量 = ∞。\n5. 最大流 = 最多可选择的区间数。\n\n本实现构造该网络并调用最大流（Edmonds-Karp）求解，并对照贪心解。',
    en: 'Interval scheduling: given n intervals [s_i, e_i) and machine count k, maximize selected intervals such that at any instant at most k are selected.\n\n**Max-flow model**:\n1. Sort all endpoints, get distinct time points t_0 < t_1 < ... < t_m.\n2. Build a "chain graph": each time point is a node; adjacent time points are connected by an edge of capacity k (the segment can hold at most k intervals).\n3. For each interval [s_i, e_i): add an edge from its start time-point to its end time-point with capacity 1 (selecting this interval "shortcuts" the chain).\n4. Add source s → t_0 and t_m → sink T with capacity ∞.\n5. The max flow equals the maximum number of selectable intervals.\n\nThis implementation builds the network and solves with Edmonds-Karp, and cross-checks with a greedy solution.',
  },
  tags: ['network', 'max-flow', 'application', 'interval-scheduling', 'reduction'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
  references: [
    {
      label: 'Interval scheduling — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Interval_scheduling',
    },
  ],
};

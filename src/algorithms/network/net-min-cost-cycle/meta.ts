// 负圈消除最小费用流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-min-cost-cycle',
  categoryId: 'network',
  title: { zh: '负圈消除最小费用流', en: 'Min-Cost Flow by Cycle Canceling' },
  summary: {
    zh: '先求任意最大流，再用 SPFA 检测并消除残量图中的负费用环直至无负圈。',
    en: 'Start from any max flow, then detect and cancel negative-cost cycles in the residual graph via SPFA until none remain.',
  },
  description: {
    zh: '负圈消除法：先在容量网络上跑最大流（任意算法），得到一个流量最大但费用未必最小的流。然后在残量图上反复用 SPFA（Bellman-Ford）找负费用环，沿环推送瓶颈流量消除负圈；当无负圈时流即为最小费用最大流。',
    en: 'Cycle-canceling method: first compute any maximum flow on the capacitated network (the cost may be suboptimal). Then repeatedly find a negative-cost cycle in the residual graph using SPFA (Bellman-Ford) and push the bottleneck around it to cancel the cycle. When no negative cycle remains, the flow is a min-cost max flow.',
  },
  tags: ['network', 'min-cost-flow', 'negative-cycle', 'cycle-canceling', 'spfa'],
  complexity: { time: 'O(V·E²·U)', space: 'O(V + E)' },
};

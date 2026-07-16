// 无向图最大流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-max-flow-undirected',
  categoryId: 'network',
  title: { zh: '无向图最大流', en: 'Undirected Max Flow' },
  summary: {
    zh: '将每条无向边替换为两条等容量有向边，在有向残量图上求源汇最大流。',
    en: 'Replace each undirected edge with two opposite directed edges of equal capacity, then run max flow on the directed residual graph.',
  },
  description: {
    zh: '无向网络最大流：边可双向通行，总流量受容量限制。技巧：把无向边 {u,v} 替换为有向边 u→v 与 v→u（同容量），残量图自然处理反向流。理论最大流等于最小割（割边为无向边集合）。',
    en: 'Undirected max flow: edges carry flow in either direction up to capacity. Replace {u,v} with directed u->v and v->u of equal capacity; the residual graph handles reverse flow natively. Max flow equals the min cut over undirected edges.',
  },
  tags: ['network', 'max-flow', 'undirected', 'min-cut', 'reduction'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
};

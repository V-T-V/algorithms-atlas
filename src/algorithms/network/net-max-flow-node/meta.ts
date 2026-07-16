// 节点容量最大流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-max-flow-node',
  categoryId: 'network',
  title: { zh: '节点容量最大流', en: 'Node-Capacitated Max Flow' },
  summary: {
    zh: '通过节点分裂（拆为入点/出点）将节点容量转化为边容量，再求最大流。',
    en: 'Convert node capacities to edge capacities by splitting each node into an in-vertex and out-vertex, then solve max flow.',
  },
  description: {
    zh: '节点容量最大流：每个节点 v 有通过容量 c(v)。把 v 拆为 v_in 与 v_out，加边 v_in→v_out 容量 c(v)；原图边 u→v 改为 u_out→v_in。在 source_out 到 sink_in 上跑标准最大流即可。',
    en: 'Node-capacitated max flow: each node v has a throughput capacity c(v). Split v into v_in and v_out joined by an edge v_in->v_out of capacity c(v); redirect each original edge u->v as u_out->v_in. Run standard max flow from source_out to sink_in.',
  },
  tags: ['network', 'max-flow', 'node-capacity', 'vertex-splitting', 'reduction'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
};

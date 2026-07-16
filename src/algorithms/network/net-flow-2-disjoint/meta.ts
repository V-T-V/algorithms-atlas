// 两点不相交路径（最大流法）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-flow-2-disjoint',
  categoryId: 'network',
  title: { zh: '两点不相交路径（最大流法）', en: 'Two Vertex-Disjoint Paths (Max-Flow)' },
  summary: {
    zh: '用单位容量最大流判断 s→t 是否存在两条点不相交路径并输出它们。',
    en: 'Use unit-capacity max-flow to find (if any) two vertex-disjoint s→t paths.',
  },
  description: {
    zh: '求两条「点不相交」的 s→t 路径：把每个点 v 拆为 v_in→v_out 的单位容量内部边（除 s、t 外），原图边改为容量 1 的有向边，求 s→t 最大流。若流量 ≥ 2 则存在两条点不相交路径，可在残量图上反推两条路。',
    en: 'To find two vertex-disjoint s→t paths: split each vertex v into v_in→v_out with a unit-capacity internal edge (except s, t), set original edges to unit capacity, and compute max-flow. If flow ≥ 2, two vertex-disjoint paths exist and can be recovered from the residual graph.',
  },
  tags: ['network', 'max-flow', 'disjoint-path', 'vertex-splitting'],
  complexity: { time: 'O(V·E)', space: 'O(V + E)' },
};

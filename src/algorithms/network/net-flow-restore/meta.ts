// 预流复原 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-flow-restore',
  categoryId: 'network',
  title: { zh: '预流复原 (Preflow → Flow)', en: 'Preflow Restoration' },
  summary: {
    zh: '将含超额流的预流通过反向推送复原为满足守恒的合法流。',
    en: 'Restore a preflow with excess back into a conservation-respecting feasible flow by pushing excess backward.',
  },
  description: {
    zh: '推送-重贴标签算法结束时得到的是预流：仅源点产生流、汇点吸收流，中间节点可能有超额流 e(v)>0。复原步骤：对所有 e(v)>0 的非源非汇节点，沿残量图的反向边（即已推送的正向边）把超额推回源点，直到所有中间节点 e(v)=0，得到合法 s-t 流。',
    en: "Push-relabel terminates with a preflow: the source produces flow, the sink absorbs it, and intermediate nodes may carry excess e(v)>0. Restoration pushes each excess node's surplus back toward the source along residual reverse edges until every intermediate node has e(v)=0, yielding a valid s-t flow.",
  },
  tags: ['network', 'max-flow', 'preflow', 'push-relabel', 'flow-conservation'],
  complexity: { time: 'O(V·E)', space: 'O(V + E)' },
};

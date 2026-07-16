import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'minimum-feedback-arc',
  categoryId: 'graph',
  title: { zh: '最小反馈弧集', en: 'Minimum Feedback Arc Set' },
  summary: {
    zh: 'Eades 启发式构造线性序，反向边即反馈弧集。',
    en: 'Eades heuristic builds a linear order; backward edges form the feedback arc set.',
  },
  description: {
    zh: '反馈弧集是有向图中删去后可使图无环的边集合；最小反馈弧集求边数最少者，是 NP 困难。Eades-Levitt-Thistlethwaite 启发式构造一个顶点线性序：反复把无入度的源点放到序头、无出度的汇点放到序尾，剩余点中选出度−入度最大者放到序头。最终序中「方向向后」的边构成反馈弧集。该算法在竞赛图上有 5 倍近似保证，通用图上为实用启发式。时间 O(V+E)。',
    en: 'A feedback arc set is a set of arcs whose removal makes a digraph acyclic; the minimum is NP-hard. The Eades-Levitt-Thistlethwaite heuristic builds a linear order by repeatedly moving sources to the front and sinks to the back, then the vertex with max out-degree minus in-degree to the front. Backward arcs in this order form the feedback arc set, with a 5-approximation guarantee on tournaments. Time O(V+E).',
  },
  tags: ['graph', 'feedback-arc', 'dag', 'heuristic', 'ordering'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};

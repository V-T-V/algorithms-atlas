import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'chordal-graph',
  categoryId: 'graph',
  title: { zh: '弦图判定', en: 'Chordal Graph' },
  summary: {
    zh: '最大基数搜索求消元序，再验证是否为完美消除序列。',
    en: 'MCS for an elimination order, then verify it is a perfect elimination order.',
  },
  description: {
    zh: '弦图（Chordal Graph）是所有长度 ≥4 的环都有一条弦的图，等价于存在完美消除序列（PEO）：按该序删除顶点时，每个顶点的「未删邻居」构成一个团。本实现先用最大基数搜索（MCS，每次选已选邻居最多的未选点）得到一个序，再用 parent 检验法验证它是否为 PEO，从而判定是否为弦图。时间 O(V+E)。',
    en: 'A chordal graph has a chord in every cycle of length at least 4, equivalent to admitting a perfect elimination order (PEO). This implementation runs maximum cardinality search (MCS, repeatedly pick the unchosen vertex with the most chosen neighbors) to get an order, then verifies it is a PEO via the parent test. Time O(V+E).',
  },
  tags: ['graph', 'chordal', 'peo', 'mcs', 'recognition'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};

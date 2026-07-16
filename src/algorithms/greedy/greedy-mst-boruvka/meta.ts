// Borůvka MST（Boruvka Minimum Spanning Tree）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-mst-boruvka',
  categoryId: 'greedy',
  title: { zh: 'Borůvka MST', en: 'Boruvka Minimum Spanning Tree' },
  summary: {
    zh: '每轮每个连通块选最短出边并行合并，O(log V) 轮完成。',
    en: 'Each round every component picks its cheapest outgoing edge in parallel; O(log V) rounds.',
  },
  description: {
    zh: 'Borůvka：初始每点为独立块，每轮每个块选连向块外的最短边合并，块数至少减半，共 O(log V) 轮。',
    en: 'Boruvka: start each vertex alone; each round every component picks cheapest edge leaving it and merges; halving each round.',
  },
  tags: ['greedy', 'mst', 'graph'],
  complexity: { time: 'O(E log V)', space: 'O(V+E)' },
};

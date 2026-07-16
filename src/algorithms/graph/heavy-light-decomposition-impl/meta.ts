// Heavy-Light Decomposition Full · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'heavy-light-decomposition-impl',
  categoryId: 'graph',
  title: { zh: '树链剖分·完整实现', en: 'Heavy-Light Decomposition (Full)' },
  summary: {
    zh: '完整重链剖分：两遍 DFS 求 size/depth/parent/top，支持路径查询/更新。',
    en: 'Full heavy-light decomposition: two DFS passes for size/depth/parent/top, supporting path queries.',
  },
  description: {
    zh: '树链剖分（HLD）把树拆成若干条重链，使任意路径上的轻边数不超过 O(log V)。第一遍 DFS 求 size、depth、parent、重儿子 heavy；第二遍 DFS 按「先重后轻」连成重链，记录 top（链顶）与 dfn（DFS 序，使每条重链对应一段连续区间）。之后路径 (u,v) 可拆为 O(log V) 段区间，配合线段树做路径查询/更新。本实现给出剖分本身。时间 O(V)。',
    en: 'HLD splits a tree into heavy chains so any root-to-node path crosses at most O(log V) light edges. First DFS computes size/depth/parent/heavy child; second DFS links chains (heavy-child-first) recording top and dfn (DFS order, so each chain is a contiguous range). A path (u,v) then decomposes into O(log V) ranges for segment-tree path queries. This module provides the decomposition itself. Time O(V).',
  },
  tags: ['graph', 'tree', 'hld', 'heavy-light', 'decomposition'],
  complexity: { time: 'O(V)', space: 'O(V)' },
};

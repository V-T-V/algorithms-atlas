// 树链剖分（重链剖分）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-heavy-light-tree',
  categoryId: 'ds',
  title: { zh: '树链剖分（重链剖分）', en: 'Heavy-Light Decomposition' },
  summary: {
    zh: '把树按「重儿子」剖分成若干重链，使任意路径 O(log n) 条链组成。',
    en: 'Splits a tree into heavy chains via the heavy child; any path is O(log n) chains.',
  },
  description: {
    zh: '重链剖分（HLD）通过两遍 DFS 计算每个节点的：子树大小 size、重儿子 heavy（size 最大的子节点）、深度 depth、顶点重链头 top、DFS 序 dfn。借助 dfn 可把树路径拆为 O(log n) 条连续区间（重链段），从而支持线段树等结构做路径聚合查询/修改。本实现提供剖分构造与路径上升演示，可扩展为求 LCA。零 DOM 依赖。',
    en: 'Heavy-light decomposition computes via two DFS each node size, heavy child (largest subtree), depth, top of its heavy chain, and dfn order. Using dfn, any tree path is decomposed into O(log n) contiguous segments (chain pieces), enabling segment-tree-style path aggregation. Provides the decomposition and path ascent; extensible to LCA. Zero DOM dependency.',
  },
  tags: ['ds', 'tree', 'heavy-light', 'decomposition', 'lca'],
  complexity: { time: 'O(n) build, O(log n) per query', space: 'O(n)' },
};

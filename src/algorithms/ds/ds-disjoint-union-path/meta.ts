// 并查集（仅路径压缩）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-disjoint-union-path',
  categoryId: 'ds',
  title: { zh: '并查集（路径压缩，无按秩）', en: 'Disjoint Set Union (Path Compression only)' },
  summary: {
    zh: '仅用路径压缩优化的并查集；find/union 近似 O(α(n))。',
    en: 'DSU with path compression only; find/union nearly O(α(n)).',
  },
  description: {
    zh: '并查集维护一组互不相交的集合，支持 find（查根）与 union（合并）。本实现只做路径压缩（find 时把路径上所有节点直接挂到根），不使用按秩合并；实测接近 O(α(n))。区别于已有的 union-find-rank（同时使用按秩合并与路径压缩）。提供 makeSet、find、union、connected、count 五个接口。零 DOM 依赖。',
    en: 'DSU maintains disjoint sets with find (root lookup) and union (merge). This uses path compression only (on find, attach every path node directly to root), without union-by-rank; practically near O(α(n)). Distinct from the existing union-find-rank (which combines both). Provides makeSet, find, union, connected, count. Zero DOM dependency.',
  },
  tags: ['ds', 'union-find', 'disjoint-set', 'path-compression'],
  complexity: { time: 'O(α(n)) amortized', space: 'O(n)' },
};

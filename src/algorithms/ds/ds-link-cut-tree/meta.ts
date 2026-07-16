// Link-Cut Tree（动态树）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-link-cut-tree',
  categoryId: 'ds',
  title: { zh: 'Link-Cut Tree（动态树，链剖分）', en: 'Link-Cut Tree (Dynamic Tree)' },
  summary: {
    zh: '用 Splay 辅助森林维护动态树，支持 link/cut/连通查询 O(log n) 摊还。',
    en: 'Splay-based auxiliary forest maintaining a dynamic tree; link/cut/connected in O(log n) amortized.',
  },
  description: {
    zh: 'Link-Cut Tree（LCT）维护一片动态森林，支持 link(u,v)（连边）、cut(u,v)（断边）、connected(u,v)（判连通）、findRoot(u)（找所在树根）。其内部用一组 Splay 树（代表实链）+ 虚边（代表链间连接）构成「辅助树」，makeroot/access 操作切换实虚边。所有操作 O(log n) 摊还。本实现聚焦连通性与 link/cut，区别于已有的 ds-heavy-light-tree（静态剖分）。零 DOM 依赖。',
    en: 'Link-Cut Tree maintains a dynamic forest with link(u,v), cut(u,v), connected(u,v), findRoot(u). Internally it uses Splay trees (real chains) plus virtual edges (between chains); makeroot/access toggles real/virtual. All O(log n) amortized. Focuses on connectivity and link/cut; distinct from ds-heavy-light-tree (static). Zero DOM dependency.',
  },
  tags: ['ds', 'link-cut-tree', 'dynamic-tree', 'splay'],
  complexity: { time: 'O(log n) amortized', space: 'O(n)' },
};

// Euler Tour Graph · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'euler-tour-graph',
  categoryId: 'graph',
  title: { zh: '欧拉序（树上 DFS 序）', en: 'Euler Tour (Tree DFS Order)' },
  summary: {
    zh: '对树做 DFS，进入与离开每个节点时都记录，得到欧拉序。',
    en: 'DFS a tree recording entry and exit of each node to form the Euler tour array.',
  },
  description: {
    zh: '树上欧拉序（也称 Euler Tour / Euler Path on Tree）：DFS 时每进入一个节点就把它追加到序列，从子树返回回到该节点时再追加一次（或只在进入时记录）。前者长度 2V-1，配合 RMQ 可 O(1) 求 LCA；后者长度 V 为标准时间戳序。本实现记录「进入序」（首次访问时间戳 dfn，in/out 时间），常用于子树查询与 LCA 预处理。时间 O(V)。',
    en: 'Tree Euler tour: append a node when first entered (and optionally when returning from a child). The 2V-1 length version supports O(1) LCA via RMQ; the V-length in-time version is the standard DFS timestamp order. We record in/out times and the entry-order sequence. Time O(V).',
  },
  tags: ['graph', 'tree', 'euler-tour', 'dfs', 'lca'],
  complexity: { time: 'O(V)', space: 'O(V)' },
};

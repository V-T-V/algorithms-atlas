// 合并两个凸包 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'merging-convex-hulls',
  categoryId: 'geometry',
  title: { zh: '合并两个凸包', en: 'Merging Two Convex Hulls' },
  summary: {
    zh: '分治凸包的合并步：找到两个凸包的公切线（上/下桥），裁掉被「夹住」的内部弧后拼接。',
    en: 'The merge step of divide-and-conquer hulls: find the common tangents (upper/lower bridge), clip the inner arcs, and stitch.',
  },
  description: {
    zh: '合并两个凸包是分治凸包算法（Preparata-Hong 1977）的核心合并步。给定两个互不相交（或一般位置）的凸包 H1、H2，要构造它们的并集的凸包 H = conv(H1 ∪ H2)。关键在找到两条「公切线」：(1) 上公切线（upper common tangent）连接 H1、H2 各一个顶点，使两个凸包都位于该线下方；(2) 下公切线类似但反向。找到两条公切线后，删除被它们「夹在中间」的内部弧（朝向另一凸包那一侧的顶点序列），把两个凸包剩余部分沿公切线拼接即得合并后的凸包。朴素合并可直接对两包所有顶点重新跑一次 Andrew 单调链 O(n)，但本实现演示真正的「找切线 + 裁剪 + 拼接」过程，单次合并 O(log n + log m)（二分找切线）。这是并行/分治凸包算法的基础。',
    en: 'Merging two convex hulls is the merge step of the divide-and-conquer hull algorithm (Preparata-Hong 1977). Given two (disjoint or in general position) convex hulls H1 and H2, construct the hull of their union H = conv(H1 ∪ H2). The key is to find the two common tangents: (1) the upper common tangent joins one vertex of each hull with both hulls below it; (2) the lower common tangent is symmetric. After finding the tangents, delete the inner arcs "clipped" between them (the vertex sequences facing the other hull), then stitch the remaining parts along the tangents. A naive merge can simply re-run Andrew\'s chain over all vertices in O(n), but this implementation shows the true "find tangents + clip + stitch" process, merging in O(log n + log m) via binary search. This underpins parallel and divide-and-conquer hull algorithms.',
  },
  tags: ['geometry', 'convex-hull', 'merge', 'tangent', 'divide-and-conquer'],
  complexity: { time: 'O(log n + log m)', space: 'O(n+m)' },
};

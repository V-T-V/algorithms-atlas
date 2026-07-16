// 在线凸包 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-convex-hull-online',
  categoryId: 'geometry',
  title: { zh: '在线凸包', en: 'Online Convex Hull' },
  summary: {
    zh: '逐点插入维护点集凸包：新点在内部则跳过，否则重建。',
    en: 'Maintain the convex hull incrementally as points arrive: skip if inside, rebuild if on the hull.',
  },
  description: {
    zh: '在线凸包：依次插入点，每次检查新点是否在当前凸包内部（所有边同侧）。\n\n- 若在内部：凸包不变\n- 若在外部：把新点加入点集后重新计算凸包（此处用 Jarvis 礼包法重建）\n\n本实现为教学版 O(n) 单次插入（重建为 O(n²)）；更优的增量法可在 O(log n) 维护切点。复杂度单次最坏 O(n²)。',
    en: 'Online convex hull: insert points one by one; each new point is tested for being inside the current hull (same side of every edge). If inside, skip; if outside, add and recompute the hull via Jarvis gift-wrapping. Educational version: O(n²) per rebuild. Advanced incremental methods maintain tangents in O(log n).',
  },
  tags: ['geometry', 'convex-hull', 'incremental', 'online'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};

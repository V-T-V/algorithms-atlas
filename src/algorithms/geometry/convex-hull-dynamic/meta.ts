// 动态凸包 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'convex-hull-dynamic',
  categoryId: 'geometry',
  title: { zh: '动态凸包（点集可增）', en: 'Dynamic Convex Hull (Incremental)' },
  summary: {
    zh: '支持点集在线新增点，每次增量维护凸包：判断新点是否在包外，若是则找出可见切线并重连。',
    en: 'Maintain the convex hull online as points are added: if a new point lies outside, find the tangents and rewire the hull.',
  },
  description: {
    zh: '动态凸包问题：维护一个不断新增点的点集的凸包，避免每次都从头重算。本实现演示**在线增量算法**（上/下凸包维护法）。核心思路：把凸包拆成「上凸包」与「下凸包」两部分，分别按 x 排序的链表维护。新增点 p 时：(1) 若 p 已在当前凸包内（对上凸包 p 在链下方、对下凸包 p 在链上方），则无需改动；(2) 否则 p 必将在新凸包上，此时从 p 向两侧扫描，删除那些因 p 加入而变为「非凸」（叉积符号错误）的点，直到恢复凸性，然后把 p 插入正确位置。单次插入均摊 O(log n)（用二分定位）至 O(n)（朴素扫描）。本实现用朴素 O(n) 插入，清晰展示「找切线 + 删除可见弧 + 重连」的过程。',
    en: 'The dynamic convex hull problem maintains the convex hull of a growing point set without recomputing from scratch. This implementation demonstrates the **online incremental algorithm** using upper/lower hull maintenance. The idea: split the hull into the "upper hull" and "lower hull", each kept as an x-sorted chain. When adding a point p: (1) if p already lies inside the current hull (below the upper chain and above the lower chain), nothing changes; (2) otherwise p will be on the new hull — scan outward from p, deleting vertices that become "non-convex" (wrong cross-product sign) due to p, until convexity is restored, then insert p at the right position. Per-insert is amortized O(log n) (with binary search) up to O(n) (naive scan). This implementation uses a naive O(n) insert to clearly show "find tangents + delete visible arc + rewire".',
  },
  tags: ['geometry', 'convex-hull', 'dynamic', 'incremental'],
  complexity: { time: 'O(n²) amortized (O(n) per insert)', space: 'O(n)' },
};

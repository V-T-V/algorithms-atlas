// 最远点对（旋转卡壳）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'farthest-pair',
  categoryId: 'geometry',
  title: { zh: '最远点对（旋转卡壳）', en: 'Farthest Pair (Rotating Calipers)' },
  summary: {
    zh: '点集中两点最大距离（直径）必在凸包顶点上；先建凸包再用旋转卡壳 O(n) 求对踵点。',
    en: 'The diameter of a point set lies on hull vertices; build the hull, then rotating calipers finds antipodal pairs in O(n).',
  },
  description: {
    zh: '最远点对问题：给定平面上 n 个点，求距离最远的两点（即点集的直径）。朴素枚举 O(n²)。关键性质：最远点对的两个点一定都在点集的凸包上（内部点到任何点的距离都不超过某个包上顶点）。因此先用 Andrew 单调链 O(n log n) 求凸包，再在凸包（设顶点数 h）上用**旋转卡壳**（Rotating Calipers, Toussaint 1983）O(h) 找到「对踵点」（antipodal pair）中的最远者。旋转卡壳：用两条平行线夹住凸包，让它们绕凸包旋转，每次让其中一条「落后」的线前进到下一条边，跟踪当前对踵点的距离，取最大。整体 O(n log n)。本实现接受原始点集，内部完成建包+卡壳全流程。',
    en: "The farthest-pair problem: given n points in the plane, find the two with the maximum distance (the set diameter). Brute force is O(n²). Key fact: both endpoints of the diameter lie on the convex hull (any interior point is dominated by some hull vertex). So first build the hull with Andrew's monotone chain in O(n log n), then apply **rotating calipers** (Toussaint 1983) on the hull (h vertices) to find the farthest antipodal pair in O(h). Rotating calipers: clamp the hull between two parallel lines and rotate them, advancing the lagging line to the next edge each step, tracking the distance of the current antipodal pair and taking the maximum. Overall O(n log n). This implementation takes the raw point set and does hull+calipers end-to-end.",
  },
  tags: ['geometry', 'convex-hull', 'rotating-calipers', 'diameter'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

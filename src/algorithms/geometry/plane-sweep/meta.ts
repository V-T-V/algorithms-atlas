// 平面扫描线（通用框架）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'plane-sweep',
  categoryId: 'geometry',
  title: { zh: '平面扫描线（通用框架）', en: 'Plane Sweep (General Framework)' },
  summary: {
    zh: '用一条扫描线扫过平面，配合状态结构（有序集）维护「活动对象」，是众多几何算法的统一范式。',
    en: 'Sweep a line across the plane while a status structure tracks active objects — a unifying paradigm for many geometric algorithms.',
  },
  description: {
    zh: '平面扫描线（Plane Sweep / Sweep Line）是计算几何最强大的通用范式之一。核心思想：用一条垂直（或水平）直线 L 从左向右扫过整个平面，在每个「事件点」（如某对象的端点、交点）处停下并更新一个称为「扫描状态」（sweep status）的有序数据结构（通常为平衡 BST）。任何对象只在 L 穿过它的「生命周期」内处于活动状态、进入状态结构；算法只在事件点处理逻辑。这一框架统一了：最近点对（扫描线 + 有序集）、线段相交（Bentley-Ottmann）、矩形并集面积（坐标离散化 + 扫描）、多边形布尔运算等。本实现演示最基础的形式：**一维区间并集长度**——给定若干 [l, r] 区间，用扫描线把它们按左端点排序，逐个事件（左端点入栈、右端点出栈）累加并集长度，O(n log n)。这是理解更复杂二维扫描的基础。',
    en: 'The plane sweep (sweep line) is one of the most powerful general paradigms in computational geometry. The idea: a vertical (or horizontal) line L sweeps across the plane from left to right, stopping at each "event point" (e.g. object endpoints, intersections) to update a "sweep status" — an ordered data structure (usually a balanced BST). An object is active and present in the status only during the "lifetime" in which L crosses it; algorithm logic happens only at events. This framework unifies the closest-pair problem (sweep + ordered set), segment intersection (Bentley-Ottmann), rectangle union area (coordinate compression + sweep), polygon boolean operations, and more. This implementation demonstrates the most basic form: **1D interval union length** — given intervals [l, r], sort their endpoints and sweep, adding intervals when their left endpoint is reached and removing them at their right endpoint, accumulating the union length in O(n log n). This is the foundation for understanding more complex 2D sweeps.',
  },
  tags: ['geometry', 'sweep-line', 'framework', 'interval'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

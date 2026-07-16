// 所有线段交点（Bentley-Ottmann）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'line-intersection-all',
  categoryId: 'geometry',
  title: {
    zh: '所有线段交点（Bentley-Ottmann）',
    en: 'All Segment Intersections (Bentley-Ottmann)',
  },
  summary: {
    zh: '扫描线 + 有序状态结构，仅对相邻活动线段测试相交，O((n+k) log n) 找出全部 k 个交点。',
    en: 'Sweep line + ordered status; test only adjacent active segments for crossings, reporting all k intersections in O((n+k) log n).',
  },
  description: {
    zh: 'Bentley-Ottmann 算法（1979）是求平面上 n 条线段全部 k 个交点的经典扫描线算法，优于朴素 O(n²)。核心：用一条竖直扫描线从左向右扫过平面，维护一个按「与扫描线交点的 y 坐标」排序的「活动线段」有序结构（状态结构，通常为平衡 BST）。关键观察：只有当前**相邻**的活动线段才可能在扫描线之前相交。事件有两类：(1) 端点事件（左端点插入、右端点删除）；(2) 交点事件（相邻两段的交点）。每当活动顺序发生变化（插入、删除、或检测到新交点），只需重新测试新成为邻居的线段对。本实现采用稳健的「事件队列 + 状态数组重排」式实现：在每个事件处用当前扫描线 x 对活动线段按 y 重排，并测试新邻居对，把发现的交点加入事件队列。总复杂度 O((n+k) log n)。对退化情形（共点、共线、端点相交）做容差处理。',
    en: "The Bentley-Ottmann algorithm (1979) is the classic sweep-line method for finding all k intersections among n segments, improving on the naive O(n²). The idea: a vertical sweep line moves left to right, maintaining an ordered 'status structure' (balanced BST) of active segments sorted by the y-coordinate of their intersection with the sweep line. Key insight: only currently **adjacent** active segments can intersect ahead of the sweep line. Events are of two kinds: (1) endpoint events (insert at left, delete at right); (2) intersection events of adjacent pairs. Whenever the active order changes (insert, delete, or a new intersection detected), only the newly-adjacent pairs need to be re-tested. This implementation uses a robust 'event queue + status re-sorting' approach: at each event, re-sort active segments by y at the current sweep x and test newly-adjacent pairs, pushing discovered intersections back into the queue. Total O((n+k) log n). Degenerate cases (coincident endpoints, collinear overlaps) are handled with tolerances.",
  },
  tags: ['geometry', 'segment-intersection', 'sweep-line', 'bentley-ottmann'],
  complexity: { time: 'O((n+k) log n)', space: 'O(n+k)' },
};

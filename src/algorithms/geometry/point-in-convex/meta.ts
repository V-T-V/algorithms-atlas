// 点在凸多边形内（二分法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'point-in-convex',
  categoryId: 'geometry',
  title: { zh: '点在凸多边形内（二分法）', en: 'Point in Convex Polygon (Binary Search)' },
  summary: {
    zh: '利用凸性：以某顶点为极点，二分定位查询点所在的扇形，单次叉积判定，O(log n)。',
    en: 'Exploit convexity: pick a vertex as polar origin, binary-search the wedge containing the query, one cross test, in O(log n).',
  },
  description: {
    zh: '判定点是否在凸多边形内：一般多边形用射线法 O(n)，但凸多边形可利用凸性做到 O(log n)。常用方法：选顶点 p0 作为「极点」，把凸多边形看成 n−2 个由 (p0, p_i, p_{i+1}) 组成的扇形（三角形扇）。对查询点 q：(1) 先用两个叉积检查 q 是否在整体角度范围 [p0→p1, p0→p_{n−1}] 之外，若在外则一定不在内部；(2) 否则二分找到 q 所在的扇形索引 k；(3) 最后用一次叉积判定 q 相对于边 (p_k, p_{k+1}) 的位置：在线左侧（逆时针凸包）则内部，右侧则外部，线上则边界。总 O(log n)。对大规模查询（如百万点对同一凸包）相比射线法有巨大优势。本实现假设输入为逆时针严格凸多边形。',
    en: 'Testing whether a point lies inside a convex polygon: a general polygon needs the O(n) ray-casting method, but convexity enables O(log n). Common approach: pick vertex p0 as the polar origin, viewing the polygon as n−2 wedges (triangle fan) (p0, p_i, p_{i+1}). For a query q: (1) first use two cross products to check whether q lies outside the overall angular range [p0→p1, p0→p_{n−1}]; (2) otherwise binary-search the wedge index k containing q; (3) do one final cross test of q against the edge (p_k, p_{k+1}): on the left (for a CCW hull) means inside, on the right means outside, on the line means boundary. Overall O(log n). For large query volumes this is a big win over ray casting. This implementation assumes a strictly convex polygon in CCW order.',
  },
  tags: ['geometry', 'convex', 'point-location', 'binary-search'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};

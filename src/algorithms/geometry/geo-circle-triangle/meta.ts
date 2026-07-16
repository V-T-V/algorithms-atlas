// 圆与三角形关系 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-circle-triangle',
  categoryId: 'geometry',
  title: { zh: '圆与三角形关系', en: 'Circle-Triangle Relationship' },
  summary: {
    zh: '判定圆与三角形的关系：相离 / 相交 / 圆包含三角形。',
    en: 'Classify a circle vs triangle as disjoint, intersecting, or circle-contains-triangle.',
  },
  description: {
    zh: '判定圆（圆心 C、半径 r）与三角形 ABC 的关系：\n\n1. 若三顶点到圆心距离都 ≤ r：**圆包含三角形**\n2. 若圆心在三角形内：必然**相交**（圆心点既在三角形又在圆内）\n3. 否则计算圆心到三角形（顶点 + 三条边）的最短距离；≤ r 为**相交**，否则**相离**\n\n点到线段距离用投影夹紧到 [0,1]。复杂度 O(1)。',
    en: 'Classify circle (center C, radius r) vs triangle ABC: (1) all vertices within r → circle contains triangle; (2) center inside triangle → intersect; (3) min distance from center to triangle (vertices+edges) ≤ r → intersect, else disjoint. Point-to-segment distance clamps projection. O(1).',
  },
  tags: ['geometry', 'circle', 'triangle', 'intersection', 'classification'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

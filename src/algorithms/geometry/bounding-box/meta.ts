// 轴对齐最小包围盒（AABB）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-bounding-box',
  categoryId: 'geometry',
  title: { zh: '轴对齐最小包围盒（AABB）', en: 'Axis-Aligned Bounding Box (AABB)' },
  summary: {
    zh: '扫描点集一次得到 min/max 的 x、y，构成轴对齐最小包围盒。',
    en: 'One pass over points yields min/max x, y forming the axis-aligned bounding box.',
  },
  description: {
    zh:
      '轴对齐最小包围盒（Axis-Aligned Bounding Box, AABB）：给定平面点集，' +
      '求包围所有点且边与坐标轴平行的最小矩形。' +
      '\n- 单次扫描求 min{x}, max{x}, min{y}, max{y}。' +
      '\n- 左下角 (minX, minY)，右上角 (maxX, maxY)。' +
      '\n- 宽 W = maxX − minX，高 H = maxY − minY，面积 = W·H，周长 = 2(W+H)。' +
      '\n- 中心 = ((minX+maxX)/2, (minY+maxY)/2)。' +
      '\n- 应用：碰撞检测、空间索引（四叉树/R-tree）、快速剔除。' +
      '\n时间 `O(n)`，空间 `O(1)`。',
    en:
      'Axis-Aligned Bounding Box (AABB): given a planar point set, find the smallest axis-aligned ' +
      'rectangle enclosing all points. ' +
      '\n- One pass: min{x}, max{x}, min{y}, max{y}. ' +
      '\n- Bottom-left (minX, minY), top-right (maxX, maxY). ' +
      '\n- Width W = maxX − minX, height H = maxY − minY, area = W·H, perimeter = 2(W+H). ' +
      '\n- Center = ((minX+maxX)/2, (minY+maxY)/2). ' +
      '\nApplications: collision detection, spatial indexing (quadtree/R-tree), quick rejection. ' +
      '\nTime O(n), space O(1).',
  },
  tags: ['geometry', 'bounding-box', 'aabb', 'scan'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// 多边形旋转 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-polygon-rotate',
  categoryId: 'geometry',
  title: { zh: '多边形旋转', en: 'Polygon Rotation' },
  summary: {
    zh: '以中心 C 把多边形整体旋转 θ。',
    en: 'Rotate a polygon about center C by angle θ.',
  },
  description: {
    zh: '每个顶点绕 C 旋转 θ：x′ = C.x + (P.x-C.x)cosθ - (P.y-C.y)sinθ。',
    en: 'Each vertex rotates about C by θ.',
  },
  tags: ['geometry', 'polygon', 'rotation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

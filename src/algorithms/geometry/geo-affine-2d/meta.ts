// 二维仿射变换 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-affine-2d',
  categoryId: 'geometry',
  title: { zh: '二维仿射变换', en: '2D Affine Transform' },
  summary: { zh: '用 2×3 仿射矩阵变换点。', en: 'Transform a point by a 2x3 affine matrix.' },
  description: {
    zh: '变换：[x′ y′] = [[a,b],[c,d]]·[x,y] + [e,f]。',
    en: 'Transform: [x′ y′] = [[a,b],[c,d]]·[x,y] + [e,f].',
  },
  tags: ['geometry', 'transformation', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

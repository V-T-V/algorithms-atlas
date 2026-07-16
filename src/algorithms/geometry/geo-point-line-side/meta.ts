// 点在直线哪侧 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-point-line-side',
  categoryId: 'geometry',
  title: { zh: '点在直线哪侧', en: 'Point-Line Side Test' },
  summary: {
    zh: '用叉积符号判断点 P 在有向直线 AB 的左/右/上。',
    en: 'Use the cross-product sign to test whether P is left/right/on directed line AB.',
  },
  description: {
    zh: '点在直线哪侧（Point-Line Side Test）：计算叉积\n\n```\ncross = (B - A) × (P - A)\n     = (Bx - Ax)(Py - Ay) - (By - Ay)(Px - Ax)\n```\n\n- cross > 0：P 在有向线 AB 的**左侧**（逆时针方向）\n- cross < 0：P 在**右侧**\n- cross = 0：P 在直线 AB **上**（共线）\n\n这是计算几何的基础原语，用于多边形包含、凸性判断、线段相交等。复杂度 O(1)。',
    en: 'Point-line side test: cross = (B-A)×(P-A). >0 means P is to the left of directed line AB (CCW), <0 right, =0 collinear. A fundamental computational-geometry primitive used in point-in-polygon, convexity, and segment intersection. O(1).',
  },
  tags: ['geometry', 'cross-product', 'orientation', 'point-line'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

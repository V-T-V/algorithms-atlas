// 贝塞尔曲线（三次 de Casteljau）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-bezier-curve-2',
  categoryId: 'geometry',
  title: { zh: '贝塞尔曲线（de Casteljau）', en: 'Bezier Curve (de Casteljau)' },
  summary: {
    zh: '用 de Casteljau 算法递归求值三次贝塞尔曲线。',
    en: 'Evaluate a cubic Bezier curve recursively via the de Casteljau algorithm.',
  },
  description: {
    zh: '贝塞尔曲线由控制点定义，端点必过首末控制点。三次贝塞尔（4 控制点 P0..P3）在参数 t∈[0,1] 的点为：\n```\nB(t) = (1-t)³P0 + 3(1-t)²t P1 + 3(1-t)t² P2 + t³ P3\n```\n\nde Casteljau 算法用递归线性插值求数值稳定：\n- 第 i 层第 j 点 = (1-t)·L[i-1][j] + t·L[i-1][j+1]\n- 经过 n 层后只剩一个点即 B(t)。\n\n复杂度 O(n²) 对单点求值（n 为阶数，三次即 3）。',
    en: 'A Bezier curve is defined by control points and passes through the first and last. Cubic (4 points) B(t) = (1-t)³P0+3(1-t)²t P1+3(1-t)t² P2+t³ P3. de Casteljau evaluates it by recursive linear interpolation (numerically stable). O(n²) per point for degree n.',
  },
  tags: ['geometry', 'bezier', 'de-casteljau', 'curve', 'interpolation'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};

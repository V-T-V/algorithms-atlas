// 贝塞尔曲线（de Casteljau）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-bezier',
  categoryId: 'geometry',
  title: { zh: '贝塞尔曲线（de Casteljau 算法）', en: 'Bezier Curve (de Casteljau)' },
  summary: {
    zh: '用 de Casteljau 递归线性插值求 n 次贝塞尔曲线上 t 处的点。',
    en: 'Compute a point on an n-degree Bezier curve at t via de Casteljau recursive interpolation.',
  },
  description: {
    zh:
      '贝塞尔曲线（de Casteljau 算法）：给定 n+1 个控制点 P0..Pn，' +
      '求参数 t∈[0,1] 对应的曲线点。' +
      '\n- 一次（线性）：B(t) = (1−t)·P0 + t·P1' +
      '\n- 二次：3 个控制点；三次：4 个控制点（最常用）' +
      '\n- de Casteljau：每一层把相邻点线性插值，直到只剩 1 点：' +
      '  P_i^(k) = (1−t)·P_i^(k−1) + t·P_{i+1}^(k−1)' +
      '\n- 优点：数值稳定、几何直观、易推广到任意次数。' +
      '\n- 时间 `O(n²)`（n = 次数），空间 `O(n)`。',
    en:
      'Bezier curve (de Casteljau): given n+1 control points P0..Pn, find the curve point at parameter t∈[0,1]. ' +
      '\n- Linear: B(t) = (1−t)·P0 + t·P1 ' +
      '\n- Quadratic: 3 control points; cubic: 4 control points (most common) ' +
      '\n- de Casteljau: linearly interpolate adjacent points layer by layer until one remains: ' +
      '  P_i^(k) = (1−t)·P_i^(k−1) + t·P_{i+1}^(k−1) ' +
      '\n- Numerically stable, geometrically intuitive, generalizes to any degree. ' +
      '\nTime O(n²) (n = degree), space O(n).',
  },
  tags: ['geometry', 'bezier', 'curve', 'interpolation'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};

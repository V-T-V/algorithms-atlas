// B 样条曲线（均匀三次）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-bspline',
  categoryId: 'geometry',
  title: { zh: 'B 样条曲线', en: 'B-Spline Curve' },
  summary: {
    zh: '均匀三次 B 样条：曲线不经过控制点，但局部可控（改一点只影响局部）。',
    en: 'Uniform cubic B-spline: the curve approximates (not passing through) control points with local support.',
  },
  description: {
    zh: '均匀三次 B 样条：对每四个相邻控制点 P0..P3，定义一段曲线：\n```\nB0=(-t³+3t²-3t+1)/6\nB1=(3t³-6t²+4)/6\nB2=(-3t³+3t²+3t+1)/6\nB3=t³/6\nC(t)=B0·P0+B1·P1+B2·P2+B3·P3\n```\n\n四条基函数之和恒为 1（仿射不变）。与贝塞尔不同，B 样条**不经过**控制点，但移动一个控制点只影响附近有限段（局部支撑），更易控制形状。\n\n复杂度 O(n) 对整条曲线采样。',
    en: 'Uniform cubic B-spline: each segment is defined by four consecutive control points P0..P3 with basis B0..B3 summing to 1. Unlike Bezier, the curve does not pass through control points but offers local support (moving one point affects only nearby segments). O(n) to sample the full curve.',
  },
  tags: ['geometry', 'bspline', 'spline', 'curve', 'approximation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

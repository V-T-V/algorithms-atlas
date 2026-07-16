// Catmull-Rom 样条 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-catmull-rom',
  categoryId: 'geometry',
  title: { zh: 'Catmull-Rom 样条', en: 'Catmull-Rom Spline' },
  summary: {
    zh: '过所有控制点的插值样条，用相邻四点 P0..P3 在 P1-P2 段求值。',
    en: 'Interpolating spline through all control points, segment P1-P2 from four neighbors P0..P3.',
  },
  description: {
    zh: 'Catmull-Rom 样条是过所有控制点的三次插值样条。对相邻四点 P0、P1、P2、P3，段 P1→P2 在 t∈[0,1] 的点为：\n```\nP(t) = 0.5 · [(2P1) + (-P0+P2)t + (2P0-5P1+4P2-P3)t² + (-P0+3P1-3P2+P3)t³]\n```\n\n满足 P(0)=P1, P(1)=P2，且切向自动取自相邻点差分，无需手动指定切向。整条曲线由 P0..Pn 链接各段构成（端点用复制延拓）。\n\n复杂度 O(n) 对整条曲线采样。',
    en: 'Catmull-Rom is a cubic interpolating spline through all control points. Segment P1→P2 from P0,P1,P2,P3: P(t)=0.5·[(2P1)+(-P0+P2)t+(2P0-5P1+4P2-P3)t²+(-P0+3P1-3P2+P3)t³]. P(0)=P1, P(1)=P2; tangents auto-derived from neighbors. O(n) to sample the full curve.',
  },
  tags: ['geometry', 'catmull-rom', 'spline', 'curve', 'interpolation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

// Hermite 曲线 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-hermite-curve',
  categoryId: 'geometry',
  title: { zh: 'Hermite 曲线', en: 'Hermite Curve' },
  summary: {
    zh: '三次 Hermite 样条：由两端点 P0/P1 与两端切向 m0/m1 定义。',
    en: 'Cubic Hermite spline defined by endpoints P0/P1 and tangents m0/m1.',
  },
  description: {
    zh: "三次 Hermite 曲线在 t∈[0,1] 上由端点 P0、P1 与端点切向量 m0、m1 定义：\n```\nH(t) = h0(t)P0 + h1(t)m0 + h2(t)P1 + h3(t)m1\nh0 = 2t³ - 3t² + 1\nh1 = t³ - 2t² + t\nh2 = -2t³ + 3t²\nh3 = t³ - t²\n```\n\nH(0)=P0, H(1)=P1，且导数 H'(0)=m0, H'(1)=m1，保证端点位置与方向可控。是 Catmull-Rom 的基础。复杂度 O(1) 单点。",
    en: "Cubic Hermite curve on t∈[0,1] defined by endpoints P0,P1 and tangents m0,m1: H(t)=h0P0+h1m0+h2P1+h3m1 with h0=2t³-3t²+1, h1=t³-2t²+t, h2=-2t³+3t², h3=t³-t². H(0)=P0, H(1)=P1, H'(0)=m0, H'(1)=m1. Basis of Catmull-Rom. O(1) per point.",
  },
  tags: ['geometry', 'hermite', 'spline', 'curve', 'interpolation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

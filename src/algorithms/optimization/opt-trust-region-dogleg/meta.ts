// 信赖域 Dogleg · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-trust-region-dogleg',
  categoryId: 'optimization',
  title: { zh: '信赖域 Dogleg 精确路径', en: 'Trust-Region Dogleg Path' },
  summary: {
    zh: '解析构造 Dogleg 两段折线（最速下降极小 → 牛顿点）并与信赖域求交。',
    en: 'Analytically build the two-segment Dogleg path (steepest-descent min → Newton point) and intersect with the trust region.',
  },
  description: {
    zh: '当二次模型 m(p)=f+gᵀp+½pᵀBp 的 B 正定时，Dogleg 方法解析地构造一条从原点出发的两段折线作为候选路径：第一段是从 0 到「Cauchy 点」p_C = −(gᵀg)/(gᵀBg)·g（最速下降方向的精确极小），第二段从 p_C 延伸到牛顿点 p_N = −B⁻¹g（全局极小）。理论上 m 沿这条折线单调下降，因此信赖域的精确解就是折线与圆 ‖p‖=Δ 的交点。本实现显式求两段与半径的交点，给出步骤类型（Cauchy / Newton / 截断），并按 ρ 比自适应 Δ。比通用的数值子问题解法快且稳定。',
    en: 'When the quadratic model m(p)=f+gᵀp+½pᵀBp has positive-definite B, the Dogleg method analytically builds a two-segment candidate path starting at the origin: the first segment runs from 0 to the Cauchy point p_C = −(gᵀg)/(gᵀBg)·g (exact minimizer along steepest descent); the second extends from p_C to the Newton point p_N = −B⁻¹g (global minimizer). The model m decreases monotonically along this polyline, so the trust-region exact solution is the intersection of the polyline with the disk ‖p‖=Δ. This implementation explicitly intersects both segments with the radius, reports the step type (Cauchy / Newton / truncated), and adapts Δ via the ratio ρ. Faster and more stable than generic numerical subproblem solvers.',
  },
  tags: ['optimization', 'trust-region', 'dogleg', 'nonlinear'],
  complexity: { time: 'O(k·n³)', space: 'O(n²)' },
};

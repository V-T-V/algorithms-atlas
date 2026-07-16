// 外接圆切线 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-circle-tangent',
  categoryId: 'geometry',
  title: { zh: '外点对圆的切线（切点）', en: 'Tangents from External Point to Circle' },
  summary: {
    zh: '求圆外一点到圆的两条切线的切点：d=|T−C|，θ=atan2，φ=acos(r/d)，切点在 θ±φ 方向。',
    en: 'Find the two tangent points from an external point to a circle.',
  },
  description: {
    zh:
      '外点对圆的切线：给定圆心 C、半径 r，与圆外一点 T，求从 T 出发的两条切线的切点。' +
      '\n几何关系：切线 TC_t 与半径 C_tC 垂直，三角形 C−T−C_t 为直角三角形。' +
      '\n- d = |T − C|（外点到圆心距离，须 > r）' +
      '\n- α = atan2(Ty − Cy, Tx − Cx)（T 相对 C 的方位角）' +
      '\n- φ = acos(r / d)（CC_t 与 CT 的夹角）' +
      '\n- 两个切点角度 = α ± φ，半径 = r' +
      '\n- 切点1 = C + r·(cos(α−φ), sin(α−φ))，切点2 = C + r·(cos(α+φ), sin(α+φ))' +
      '\n时间 `O(1)`，空间 `O(1)`。',
    en:
      'Tangents from an external point to a circle: given center C, radius r, and an external point T, ' +
      'find the two tangent points. ' +
      '\nThe tangent is perpendicular to the radius at the tangent point, so triangle C−T−C_t is right-angled. ' +
      '\n- d = |T − C| (must be > r) ' +
      '\n- α = atan2(Ty − Cy, Tx − Cx) (bearing of T from C) ' +
      '\n- φ = acos(r / d) (angle between CC_t and CT) ' +
      '\n- Tangent points at bearing α ± φ with radius r. ' +
      '\nTime O(1), space O(1).',
  },
  tags: ['geometry', 'circle', 'tangent', 'trigonometry'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

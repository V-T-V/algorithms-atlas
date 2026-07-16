// 扇形面积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-sector-area',
  categoryId: 'geometry',
  title: { zh: '扇形面积', en: 'Sector Area' },
  summary: {
    zh: '圆扇形面积 A = ½ · r² · θ（θ 弧度），或由弧长 L 给出 A = ½ · r · L。',
    en: 'Circular sector area A = ½ · r² · θ (θ in radians), or A = ½ · r · L from arc length.',
  },
  description: {
    zh:
      '扇形面积（Sector Area）：圆心角 θ（弧度）与两条半径围成的扇形面积。' +
      '\n- 角度公式：`A = ½ · r² · θ`' +
      '\n- 弧长公式：`A = ½ · r · L`（L 为弧长）' +
      '\n- 由度数：先 `θ = deg · π / 180`' +
      '\n- 整圆 θ = 2π → A = π·r²（圆面积）' +
      '\n时间 `O(1)`，空间 `O(1)`。',
    en:
      'Sector Area: area enclosed by a central angle θ (radians) and two radii. ' +
      '\n- Angle form: A = ½ · r² · θ ' +
      '\n- Arc-length form: A = ½ · r · L ' +
      '\n- From degrees: convert θ = deg · π / 180 first ' +
      '\n- Full circle θ = 2π → A = π·r² ' +
      '\nTime O(1), space O(1).',
  },
  tags: ['geometry', 'circle', 'sector', 'area'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

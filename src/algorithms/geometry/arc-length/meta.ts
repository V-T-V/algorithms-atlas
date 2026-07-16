// 圆弧长度 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-arc-length',
  categoryId: 'geometry',
  title: { zh: '圆弧长度', en: 'Arc Length' },
  summary: {
    zh: '圆弧长 L = r · θ（θ 为弧度制圆心角）；也可由弦长反推。',
    en: 'Arc length L = r · θ (θ in radians); also derivable from chord length.',
  },
  description: {
    zh:
      '圆弧长度（Arc Length）：圆心角 θ（弧度制）对应的弧长。' +
      '\n- 基本公式：`L = r · θ`' +
      '\n- 由弦长 c 反推：`θ = 2 · asin(c / (2r))`，再代入 L = r·θ' +
      '\n- 由直径与圆心角度数：先把度数转弧度 `θ = deg · π / 180`' +
      '\n- 完圆周长 = 2πr（θ = 2π）' +
      '\n时间 `O(1)`，空间 `O(1)`。',
    en:
      'Arc Length: the length of an arc subtended by a central angle θ (radians). ' +
      '\n- Basic formula: L = r · θ ' +
      '\n- From chord length c: θ = 2 · asin(c / (2r)), then L = r · θ ' +
      '\n- From degree measure: convert θ = deg · π / 180 first ' +
      '\n- Full circumference = 2πr (θ = 2π) ' +
      '\nTime O(1), space O(1).',
  },
  tags: ['geometry', 'circle', 'arc', 'length'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

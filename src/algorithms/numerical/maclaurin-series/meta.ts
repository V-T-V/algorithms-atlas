// 麦克劳林级数（数值求导）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-maclaurin-series',
  categoryId: 'numerical',
  title: { zh: '麦克劳林级数（数值求导）', en: 'Maclaurin Series (Numerical Derivatives)' },
  summary: {
    zh: '在 0 处用数值差分自动求各阶导数，构造 f 的麦克劳林逼近多项式。',
    en: 'Numerically differentiate f at 0 to auto-build its Maclaurin approximation polynomial.',
  },
  description: {
    zh:
      '麦克劳林级数（Maclaurin Series）：泰勒级数在 a=0 的特例：M_n(x) = Σ_{k=0}^{n} f⁽ᵏ⁾(0)/k! · xᵏ。' +
      '\n本实现用「数值求导」自动得到 f 在 0 处的各阶导数值，再代入级数公式：' +
      '\n- 用中心差分递推求高阶导数：f⁽ᵏ⁾(0) ≈ 复合差分' +
      '\n- 简化实现：以小步长 h 用前向有限差分递归计算 f⁽ᵏ⁾(0)' +
      '\n- 例：Math.exp / Math.sin / Math.cos 等可直接传入' +
      '\n- 优点：无需手算解析导数；缺点：高阶数值导数误差累积，n 不宜过大' +
      '\n时间 `O(n²)`（n 次数值求导），空间 `O(n)`。',
    en:
      'Maclaurin Series: the a=0 special case of Taylor: M_n(x) = Σ_{k=0}^{n} f⁽ᵏ⁾(0)/k! · xᵏ. ' +
      '\nThis implementation numerically computes derivatives of f at 0, then plugs into the series: ' +
      '\n- Uses finite-difference recursion to get higher derivatives at 0 ' +
      '\n- e.g. pass Math.exp / Math.sin / Math.cos directly ' +
      '\n- Pro: no analytic derivatives needed; Con: high-order numerical derivatives accumulate error, keep n small ' +
      '\nTime O(n²) (n numerical derivatives), space O(n).',
  },
  tags: ['numerical', 'series', 'maclaurin', 'derivative'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};

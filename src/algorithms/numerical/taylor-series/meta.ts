// 泰勒级数展开 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-taylor-series',
  categoryId: 'numerical',
  title: { zh: '泰勒级数展开', en: 'Taylor Series Expansion' },
  summary: {
    zh: '在 a 点用导数值构造多项式逼近：f(x) ≈ Σ f⁽ᵏ⁾(a)/k! · (x−a)ᵏ。',
    en: 'Approximate f near a by a polynomial of derivative values: f(x) ≈ Σ f⁽ᵏ⁾(a)/k! · (x−a)ᵏ.',
  },
  description: {
    zh:
      '泰勒级数（Taylor Series）：在展开点 a 附近，用 f 的各阶导数值构造 n 次多项式逼近 f。' +
      '\n- 公式：T_n(x) = Σ_{k=0}^{n} f⁽ᵏ⁾(a) / k! · (x − a)ᵏ' +
      "\n- 输入：导数列表 [f(a), f'(a), f''(a), ...]（即各阶导在 a 处的值）" +
      '\n- 项数越多越精确（在收敛半径内）' +
      '\n- a = 0 时为麦克劳林级数' +
      '\n- 例：eˣ 在 0 处 = Σ xᵏ/k!；sin(x) = x − x³/6 + x⁵/120 − ...' +
      '\n时间 `O(n)`（n = 项数），空间 `O(1)`。',
    en:
      'Taylor Series: approximate f near expansion point a using an n-degree polynomial built from ' +
      'derivative values of f at a. ' +
      '\n- Formula: T_n(x) = Σ_{k=0}^{n} f⁽ᵏ⁾(a) / k! · (x − a)ᵏ ' +
      "\n- Input: derivative values [f(a), f'(a), f''(a), ...] at a " +
      '\n- More terms → more accuracy (within convergence radius) ' +
      '\n- a = 0 gives the Maclaurin series ' +
      '\n- e.g. eˣ at 0 = Σ xᵏ/k!; sin(x) = x − x³/6 + x⁵/120 − ... ' +
      '\nTime O(n) (n = terms), space O(1).',
  },
  tags: ['numerical', 'series', 'taylor', 'approximation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// Goldstein 条件线搜索 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-line-search-goldstein',
  categoryId: 'optimization',
  title: { zh: 'Goldstein 条件线搜索', en: 'Goldstein Conditions Line Search' },
  summary: {
    zh: '用两条平行于 Armijo 切线的不等式夹住步长：上方防过大，下方防过小。',
    en: 'Pins the step between two lines parallel to the Armijo tangent: an upper bound against too-large steps and a lower bound against too-small steps.',
  },
  description: {
    zh: 'Goldstein 条件取一个常数 c ∈ (0, ½)，要求步长 α 同时满足：\n(上) `f(x+αp) ≤ f(x) + c·α·gᵀp`（防步长过大，即 Armijo）；\n(下) `f(x+αp) ≥ f(x) + (1-c)·α·gᵀp`（防步长过小）。\n\n两条不等式在 α 平面上夹出一段可接受区间。本实现采用**二分收缩**：若违反上界则步长太大，向左缩；若违反下界则步长太小，向右扩，直到落入区间或达到迭代上限。\n\n与 Wolfe 相比，Goldstein 不需要梯度计算（仅函数值），但下界可能把真正最优步长排除掉，故对精度要求高的问题不如 Wolfe。',
    en: 'The Goldstein conditions pick a constant c ∈ (0, ½) and require α to satisfy:\n(upper) `f(x+αp) ≤ f(x) + c·α·gᵀp` (against too-large steps, i.e. Armijo);\n(lower) `f(x+αp) ≥ f(x) + (1-c)·α·gᵀp` (against too-small steps).\n\nThe two inequalities bracket an acceptable interval on the α-axis. This implementation uses **bisection shrink**: violating the upper bound means the step is too large (shrink left); violating the lower bound means too small (grow right); iterate until landing in the interval or hitting the cap.\n\nCompared with Wolfe, Goldstein needs no gradient (function values only), but the lower bound can exclude the true optimal step, so it is less accurate than Wolfe on precision-critical problems.',
  },
  tags: ['optimization', 'line-search', 'goldstein', 'first-order'],
  complexity: { time: 'O(k·c(x))', space: 'O(1)' },
};

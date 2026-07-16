// Euler-Maclaurin 求和公式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-euler-maclaurin',
  categoryId: 'numerical',
  title: { zh: 'Euler-Maclaurin 求和公式', en: 'Euler-Maclaurin Summation' },
  summary: {
    zh: '用函数在端点的导数把离散和与连续积分类联，快速逼近 Σf(k)。',
    en: 'Relates a discrete sum to an integral plus endpoint derivative corrections, accelerating evaluation of Σf(k).',
  },
  description: {
    zh: 'Euler-Maclaurin 公式把求和与积分联系起来：\n```\nΣ_{k=a}^{b} f(k) = ∫_a^b f(x) dx + (f(a)+f(b))/2 + Σ_{k=1}^{p} B_{2k}/(2k)! · [f^{(2k-1)}(b) - f^{(2k-1)}(a)] + R_p\n```\nB_{2k} 为伯努利数：B₂=1/6, B₄=-1/30, B₆=1/42, B₈=-1/30, ...\n\n用途：\n1. 加速级数求和（如调和数 H_n 的精确近似）\n2. Stirling 公式、Γ 函数近似的基础\n\n本实现提供数值微分版本（不要求解析导数）。复杂度 O(p)，p 为修正项数。',
    en: 'Euler-Maclaurin relates sum to integral: Σf(k) = ∫f dx + (f(a)+f(b))/2 + Σ_{k=1}^{p} B_{2k}/(2k)!·[f^{(2k-1)}(b)-f^{(2k-1)}(a)] + R. Bernoulli numbers B₂=1/6, B₄=-1/30, B₆=1/42. Used to accelerate series sums (e.g. harmonic numbers H_n) and as basis for Stirling / Γ approximations. This implementation uses numerical derivatives. Complexity O(p).',
  },
  tags: ['numerical', 'summation', 'euler-maclaurin', 'bernoulli', 'series'],
  complexity: { time: 'O(p)', space: 'O(1)' },
};

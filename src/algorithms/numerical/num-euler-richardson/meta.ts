// Euler 法 + Richardson 外推 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-euler-richardson',
  categoryId: 'numerical',
  title: { zh: '欧拉法 + Richardson 外推', en: 'Euler Method + Richardson Extrapolation' },
  summary: {
    zh: "用前向欧拉法积分 ODE y'=f(t,y)，并用 Richardson 外推提升精度。",
    en: "Integrate ODE y'=f(t,y) with forward Euler and improve accuracy via Richardson extrapolation.",
  },
  description: {
    zh: '前向欧拉法：y_{n+1} = y_n + h·f(t_n, y_n)，一阶精度（O(h)）。\n\nRichardson 外推：对相同区间用步长 h 和 h/2 各积分一次，得近似 A(h) 与 A(h/2)，由于误差 ∝ h，外推\n```\nA* ≈ 2·A(h/2) - A(h)\n```\n可消去一阶误差项，整体接近二阶精度。\n\n复杂度 O(n)，n = 步数。',
    en: 'Forward Euler: y_{n+1}=y_n+h·f(t_n,y_n), first order O(h). Richardson extrapolation: integrate with step h and h/2 over the same interval to get A(h) and A(h/2); since error ∝ h, A*≈2·A(h/2)-A(h) cancels the leading error term, approaching second-order accuracy. Complexity O(n).',
  },
  tags: ['numerical', 'ode', 'euler', 'richardson', 'extrapolation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// Heun 方法 (改进欧拉) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'heun-method',
  categoryId: 'numerical',
  title: { zh: 'Heun 方法 (改进欧拉)', en: 'Heun Method (Improved Euler)' },
  summary: {
    zh: '预测-校正 RK2：欧拉预测 + 梯形校正，二阶。',
    en: 'Predict-correct RK2: Euler predictor + trapezoid corrector; second order.',
  },
  description: {
    zh: 'Heun 方法（改进欧拉/显式梯形法）是 RK2 的另一形式：先用欧拉法预测 y* = y + h·f(x,y)，再在 (x+h, y*) 处求斜率 k2，最后用两点斜率的平均推进 y ← y + (h/2)(k1 + k2)。它等价于显式梯形公式，局部截断误差 O(h³)。',
    en: "Heun's method (improved Euler / explicit trapezoid) is another RK2 form: first predict y* = y + h·f(x,y) by Euler, evaluate the slope k2 at (x+h, y*), and advance with the average slope y ← y + (h/2)(k1 + k2). Equivalent to the explicit trapezoid rule, with local truncation O(h³).",
  },
  tags: ['numerical', 'ode', 'runge-kutta'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

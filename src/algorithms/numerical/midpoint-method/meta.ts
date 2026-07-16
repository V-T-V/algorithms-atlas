// 中点法 (Midpoint Method) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'midpoint-method',
  categoryId: 'numerical',
  title: { zh: '中点法 (Midpoint)', en: 'Midpoint Method' },
  summary: {
    zh: '改进欧拉：用中点斜率推进，二阶精度。',
    en: 'Improved Euler: advance using the midpoint slope; second-order accurate.',
  },
  description: {
    zh: "中点法（RK2 的中点形式）解 ODE y'=f(x,y)：在每步先用欧拉法预估到中点 (x+h/2, y+h/2·k1)，在中点求斜率 k2，再用 k2 推进整步 y ← y + h·k2。比欧拉法高一阶（局部截断误差 O(h³)），仍是单步显式，计算量比 RK4 小。",
    en: "The midpoint method (midpoint form of RK2) solves y'=f(x,y): each step first predicts the midpoint (x+h/2, y+h/2·k1) via Euler, evaluates the slope k2 there, and advances the full step with y ← y + h·k2. It is one order higher than Euler (local truncation O(h³)) while remaining a single-step explicit method, cheaper than RK4.",
  },
  tags: ['numerical', 'ode', 'runge-kutta'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

// RK4 方程组 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rk4-system',
  categoryId: 'numerical',
  title: { zh: 'RK4 方程组', en: 'RK4 for Systems' },
  summary: {
    zh: '用经典 RK4 同时推进耦合 ODE 方程组。',
    en: 'Apply classical RK4 to advance a coupled ODE system simultaneously.',
  },
  description: {
    zh: '把单变量 RK4 推广到向量：状态 y 是 n 维向量，右端 F(x, y) 返回同维向量。每步算 4 个斜率向量 K1..K4（按各自的 RK4 公式在 y 上做线性组合），最后 y ← y + (h/6)(K1 + 2K2 + 2K3 + K4)。可解 Lotka-Volterra、SIR 等耦合系统。',
    en: "Generalize scalar RK4 to vectors: the state y is an n-vector and the right-hand side F(x, y) returns an n-vector. Each step computes four slope vectors K1..K4 (with RK4's usual linear combinations over y) and updates y ← y + (h/6)(K1 + 2K2 + 2K3 + K4). Solves coupled systems like Lotka-Volterra or SIR.",
  },
  tags: ['numerical', 'ode', 'runge-kutta', 'system'],
  complexity: { time: 'O(n·s)', space: 'O(s)' },
};

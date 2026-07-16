// Dormand-Prince RK45（DOPRI5）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-rk-dopri',
  categoryId: 'numerical',
  title: { zh: 'Dormand-Prince RK45（DOPRI5）', en: 'Dormand-Prince RK45 (DOPRI5)' },
  summary: {
    zh: 'Dormand-Prince 5(4) 嵌入式方法：6 级 FSAL，5 阶解 + 4 阶误差估计。',
    en: 'Dormand-Prince 5(4) embedded method: 6-stage FSAL with 5th order solution and 4th order error estimate.',
  },
  description: {
    zh: 'DOPRI5（Dormand-Prince）：6 级嵌入式 RK，特点是 FSAL（First Same As Last）——最后一级 k7 与下一步的 k1 相同，可省一次求值。\n- 5 阶解：y_{n+1} = y_n + h·Σ b_i·k_i\n- 4 阶误差：e = h·Σ (b_i - b̂_i)·k_i\n\n自适应步长：s = (tol·h / (2·e))^(1/5)，步长乘 s（夹在 [0.2, 5]）。\n这是 MATLAB ode45、scipy RK45 的默认方法。复杂度平均 O(1) 每接受步。',
    en: 'DOPRI5 (Dormand-Prince): 6-stage embedded RK with FSAL — the last stage k7 equals the next step k1, saving one evaluation. 5th-order solution y_{n+1}=y_n+h·Σb_i k_i; 4th-order error e=h·Σ(b_i-b̂_i)k_i. Adaptive step s=(tol·h/(2·e))^(1/5). The default for MATLAB ode45 and scipy RK45. Average O(1) per accepted step.',
  },
  tags: ['numerical', 'ode', 'runge-kutta', 'dopri5', 'adaptive'],
  complexity: { time: 'O(1) per step', space: 'O(1)' },
};

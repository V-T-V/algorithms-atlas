// RK45 自适应（Runge-Kutta-Fehlberg）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-rk45',
  categoryId: 'numerical',
  title: { zh: 'RK45 自适应（Runge-Kutta-Fehlberg）', en: 'Adaptive RK45 (Runge-Kutta-Fehlberg)' },
  summary: {
    zh: '用 Fehlberg 的 6 级公式同时算 4 阶和 5 阶解，按误差估计自适应调步长。',
    en: 'Fehlberg 6-stage formula computing both 4th and 5th order solutions, with adaptive step size from the embedded error estimate.',
  },
  description: {
    zh: 'Runge-Kutta-Fehlberg（RKF45）：用 6 次函数求值得到 4 阶 y4 和 5 阶 y5 两个近似，误差估计 e=|y5-y4|。\n\n6 级系数（Cash-Karp/Dormand-Prince 同类）：用经典 Fehlberg 系数 a, b, c 计算各级 k_i。\n\n自适应：\n- 若 e ≤ tol：接受步长，更新 t,y\n- 新步长 h_new = h · s，其中 s = 0.84·(tol·h/e)^(1/4)，并夹在 [0.1h, 5h]\n\n复杂度平均 O(1) 每接受步。',
    en: 'RKF45: 6 function evaluations yield both a 4th-order y4 and 5th-order y5 approximation; error estimate e=|y5-y4|. Adaptive: accept step if e≤tol, set h_new=h·s with s=0.84·(tol·h/e)^(1/4), clamped to [0.1h, 5h]. Average O(1) per accepted step.',
  },
  tags: ['numerical', 'ode', 'runge-kutta', 'adaptive', 'rk45'],
  complexity: { time: 'O(1) per step', space: 'O(1)' },
};

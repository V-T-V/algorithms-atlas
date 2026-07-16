// 速度 Verlet 积分（辛）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-verlet',
  categoryId: 'numerical',
  title: { zh: '速度 Verlet 积分', en: 'Velocity Verlet Integration' },
  summary: {
    zh: '经典辛二阶积分器：同步更新位置与速度，适合分子动力学与守恒系统。',
    en: 'Classic symplectic second-order integrator with synchronous position/velocity updates; for molecular dynamics and conservative systems.',
  },
  description: {
    zh: "速度 Verlet（velocity Verlet）对 x'' = a(x)：\n```\nx_{n+1} = x_n + h·v_n + (h²/2)·a(x_n)\nv_{n+1} = v_n + (h/2)·[a(x_n) + a(x_{n+1})]\n```\n即先用当前加速度更新位置，再用新旧两点的平均加速度更新速度。等价于蛙跳但显式给出整数步的速度。\n二阶精度、辛（能量长周期振荡不漂移）。分子动力学（MD）的事实标准。复杂度 O(n)。",
    en: "Velocity Verlet for x''=a(x): x_{n+1}=x_n+h·v_n+(h²/2)a(x_n); v_{n+1}=v_n+(h/2)[a(x_n)+a(x_{n+1})]. Equivalent to leapfrog but gives velocities at integer steps. Second order, symplectic (energy oscillates, no drift). The de facto standard for molecular dynamics (MD). Complexity O(n).",
  },
  tags: ['numerical', 'ode', 'symplectic', 'verlet', 'molecular-dynamics'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// Leapfrog 蛙跳积分（辛积分）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-leapfrog',
  categoryId: 'numerical',
  title: { zh: 'Leapfrog 蛙跳积分', en: 'Leapfrog Integration' },
  summary: {
    zh: '位置与速度交错（半步）更新的辛二阶积分器，适合保守哈密顿系统。',
    en: 'Symplectic second-order integrator with staggered (half-step) position/velocity updates; ideal for conservative Hamiltonian systems.',
  },
  description: {
    zh: "Leapfrog 蛙跳法对 x'' = a(x)（保守力，哈密顿量守恒）：\n```\nv_{1/2} = v_0 + (h/2)·a(x_0)\nx_{n+1} = x_n + h·v_{n+1/2}\nv_{n+3/2} = v_{n+1/2} + h·a(x_{n+1})\n```\n即「半步速度 → 全步位置 → 全步速度 → ...」，最后半步收尾。位置与速度像青蛙跳一样交错，二阶精度，辛（长期能量守恒）。\n\n典型用于天体力学、分子动力学。复杂度 O(n)。",
    en: "Leapfrog for x''=a(x) (conservative Hamiltonian): v_{1/2}=v_0+(h/2)a(x_0); x_{n+1}=x_n+h·v_{n+1/2}; v_{n+3/2}=v_{n+1/2}+h·a(x_{n+1}). Position and velocity update staggered like a frog jumping; second order, symplectic (long-term energy conservation). Used in celestial mechanics, molecular dynamics. Complexity O(n).",
  },
  tags: ['numerical', 'ode', 'symplectic', 'leapfrog', 'hamiltonian'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// 牛顿分形 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-newton-fractal',
  categoryId: 'numerical',
  title: { zh: '牛顿分形', en: 'Newton Fractal' },
  summary: {
    zh: "对每个起点用牛顿迭代 z ← z − f(z)/f'(z)，按收敛到的根与迭代次数着色。",
    en: "Newton iteration z ← z − f(z)/f'(z) from each seed; color by root reached and iteration count.",
  },
  description: {
    zh:
      '牛顿分形（Newton Fractal）：在复平面上对每个起始点 z₀ 用牛顿法求多项式 f 的零点，' +
      '根据「收敛到哪个根」与「迭代次数」生成彩色分形。' +
      "\n- 迭代：z_{n+1} = z_n − f(z_n) / f'(z_n)" +
      '\n- 经典示例：f(z) = z³ − 1，根为 1, e^{2πi/3}, e^{4πi/3}' +
      '\n- 收敛判据：|f(z)| < ε 或达到最大迭代次数' +
      '\n- 起点 z₀ 落入哪个根的吸引盆 → 着相应颜色' +
      '\n- 时间 `O(W·H·K)`（W×H 网格 × K 次最大迭代），空间 `O(W·H)`。',
    en:
      "Newton Fractal: for each starting point z₀ on the complex plane, apply Newton's method to find " +
      'a root of polynomial f, then color by which root is reached and how many iterations. ' +
      "\n- Iteration: z_{n+1} = z_n − f(z_n) / f'(z_n) " +
      '\n- Classic example: f(z) = z³ − 1, roots 1, e^{2πi/3}, e^{4πi/3} ' +
      '\n- Convergence test: |f(z)| < ε or max iterations reached ' +
      '\n- The basin of attraction a seed falls into determines its color ' +
      '\nTime O(W·H·K) (grid × max iters), space O(W·H).',
  },
  tags: ['numerical', 'fractal', 'newton', 'complex'],
  complexity: { time: 'O(W·H·K)', space: 'O(W·H)' },
};

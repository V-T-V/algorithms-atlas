// 傅里叶级数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-fourier-series',
  categoryId: 'numerical',
  title: { zh: '傅里叶级数', en: 'Fourier Series' },
  summary: {
    zh: '把周期函数分解为正余弦和：a0/2 + Σ(aₙcos + bₙsin)，用数值积分求系数。',
    en: 'Decompose a periodic function into sines/cosines: a0/2 + Σ(aₙcos + bₙsin); numerical integration for coefficients.',
  },
  description: {
    zh:
      '傅里叶级数（Fourier Series）：把周期 2L 的函数 f 表为正弦余弦的线性组合。' +
      '\n- f(x) ≈ a0/2 + Σ_{n=1}^{N} [aₙ·cos(nπx/L) + bₙ·sin(nπx/L)]' +
      '\n- 系数（数值积分，梯形法）：' +
      '\n  a0 = (1/L)·∫_{−L}^{L} f(x) dx' +
      '\n  aₙ = (1/L)·∫_{−L}^{L} f(x)·cos(nπx/L) dx' +
      '\n  bₙ = (1/L)·∫_{−L}^{L} f(x)·sin(nπx/L) dx' +
      '\n- 应用：信号分析、谐波分解、偏微分方程求解。' +
      '\n- N 越大逼近越精（在收敛条件下）。' +
      '\n时间 `O(N·M)`（N 项 × M 积分采样点），空间 `O(N)`。',
    en:
      'Fourier Series: express a 2L-periodic function f as a linear combination of sines and cosines. ' +
      '\n- f(x) ≈ a0/2 + Σ_{n=1}^{N} [aₙ·cos(nπx/L) + bₙ·sin(nπx/L)] ' +
      '\n- Coefficients (trapezoidal numerical integration): ' +
      '\n  a0 = (1/L)·∫_{−L}^{L} f(x) dx ' +
      '\n  aₙ = (1/L)·∫_{−L}^{L} f(x)·cos(nπx/L) dx ' +
      '\n  bₙ = (1/L)·∫_{−L}^{L} f(x)·sin(nπx/L) dx ' +
      '\n- Applications: signal analysis, harmonic decomposition, PDE solving. ' +
      '\nTime O(N·M) (N terms × M samples), space O(N).',
  },
  tags: ['numerical', 'fourier', 'series', 'signal'],
  complexity: { time: 'O(N·M)', space: 'O(N)' },
};

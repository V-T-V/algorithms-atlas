// 粒子滤波 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'particle-filter',
  categoryId: 'optimization',
  title: { zh: '粒子滤波', en: 'Particle Filter' },
  summary: {
    zh: '用一组带权重的粒子（蒙特卡洛样本）近似任意非线性/非高斯后验，支持强非线性系统。',
    en: 'Approximates arbitrary nonlinear/non-Gaussian posteriors with a set of weighted Monte-Carlo particles; handles strong nonlinearities.',
  },
  description: {
    zh: '粒子滤波（序贯蒙特卡洛 SMC）用 N 个带权重粒子 `{x⁽ⁱ⁾, w⁽ⁱ⁾}` 近似后验分布 p(x_k|z_{1:k})。\n\n循环（Bootstrap 版）：\n1. **预测**：每个粒子按转移模型 `x⁽ⁱ⁾_k = f(x⁽ⁱ⁾_{k−1}) + noise` 前进；\n2. **加权**：按观测似然更新 `w⁽ⁱ⁾ ∝ p(z_k|x⁽ⁱ⁾_k)`，归一化；\n3. **重采样**：按权重重新抽取 N 个粒子（低权重消亡、高权重复制），避免退化。\n\n状态估计 = 加权均值。\n\n优点：处理任意非线性/非高斯、多模后验；缺点：粒子退化、计算量随 N 增大。',
    en: 'The particle filter (Sequential Monte Carlo, SMC) uses N weighted particles `{x⁽ⁱ⁾, w⁽ⁱ⁾}` to approximate the posterior p(x_k|z_{1:k}).\n\nLoop (bootstrap version):\n1. **Predict**: advance each particle via the transition `x⁽ⁱ⁾_k = f(x⁽ⁱ⁾_{k−1}) + noise`;\n2. **Weight**: update `w⁽ⁱ⁾ ∝ p(z_k|x⁽ⁱ⁾_k)`, normalize;\n3. **Resample**: draw N particles by weight (low-weight die, high-weight multiply) to fight degeneracy.\n\nEstimate = weighted mean.\n\nPros: handles arbitrary nonlinear/non-Gaussian, multimodal posteriors; cons: particle degeneracy, cost scales with N.',
  },
  tags: ['optimization', 'filtering', 'monte-carlo', 'nonlinear', 'bayesian'],
  complexity: { time: 'O(T·N)', space: 'O(N·d)' },
};

// 贝叶斯优化 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bayesian-optimization',
  categoryId: 'optimization',
  title: { zh: '贝叶斯优化', en: 'Bayesian Optimization' },
  summary: {
    zh: '用高斯过程代理模型 + 期望改进（EI）采集函数，以极少的评估次数优化昂贵黑盒目标。',
    en: 'Optimizes expensive black-box objectives with few evaluations using a Gaussian-process surrogate and Expected Improvement acquisition.',
  },
  description: {
    zh: '贝叶斯优化适合**评估昂贵**（如超参训练）的黑盒函数 `f`。\n\n核心组件：\n1. **代理模型**：高斯过程（GP）对已观测点拟合，给出预测均值 μ(x) 与方差 σ²(x)（含不确定度）；\n2. **采集函数**：期望改进 EI(x) = E[max(0, f*−f(x))]，在「预测好」与「不确定」间权衡。\n\n循环：\n- 用当前观测拟合 GP；\n- 最大化 EI 选取下一个评估点；\n- 评估 f 后加入观测。\n\nEI 的闭式（高斯假设下）：`EI = (f*−μ)Φ(z) + σφ(z)`，其中 `z = (f*−μ)/σ`。',
    en: 'Bayesian optimization targets **expensive-to-evaluate** black-box functions `f` (e.g., hyperparameter tuning).\n\nComponents:\n1. **Surrogate**: a Gaussian Process (GP) fit on observed points, giving predictive mean μ(x) and variance σ²(x) with uncertainty;\n2. **Acquisition**: Expected Improvement EI(x) = E[max(0, f*−f(x))], trading off prediction quality against uncertainty.\n\nLoop:\n- Fit GP on current observations;\n- maximize EI to pick the next point;\n- evaluate f and add to observations.\n\nClosed-form EI (Gaussian assumption): `EI = (f*−μ)Φ(z) + σφ(z)` where `z = (f*−μ)/σ`.',
  },
  tags: ['optimization', 'bayesian', 'surrogate', 'expensive-evaluation'],
  complexity: { time: 'O(n³·T)', space: 'O(n²)' },
};

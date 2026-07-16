// AMSGrad · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-amsgrad-2',
  categoryId: 'optimization',
  title: { zh: 'AMSGrad', en: 'AMSGrad' },
  summary: {
    zh: 'AMSGrad：修正 Adam 在非凸情形下学习率反弹的问题，取 v 的历史最大值。',
    en: 'AMSGrad: fixes Adam learning-rate rebound on non-convex problems by taking the max of v over history.',
  },
  description: {
    zh: 'AMSGrad（Reddi 2018）：维护 v̂ = max(v̂, v)，用 v̂ 而非 v 计算步长，确保有效学习率单调下降。',
    en: 'AMSGrad (Reddi 2018): maintain v̂ = max(v̂, v) and use v̂ instead of v for the step, guaranteeing monotonic effective lr.',
  },
  tags: ['optimization', 'adam'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

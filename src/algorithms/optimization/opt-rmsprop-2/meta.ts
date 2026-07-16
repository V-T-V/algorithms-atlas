// RMSProp · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-rmsprop-2',
  categoryId: 'optimization',
  title: { zh: 'RMSProp', en: 'RMSProp' },
  summary: {
    zh: 'RMSProp：用指数滑动平均替代 AdaGrad 的全历史，避免学习率过早衰减。',
    en: 'RMSProp: exponential moving average of squared gradients replaces AdaGrad full history to avoid premature decay.',
  },
  description: {
    zh: 'RMSProp（Hinton）：v ← ρ·v + (1−ρ)·g²；θ ← θ − lr·g/√(v+ε)。解决 AdaGrad 学习率单调下降的问题。',
    en: 'RMSProp (Hinton): v ← ρ·v + (1−ρ)·g²; θ ← θ − lr·g/√(v+ε). Solves the monotonic-decay problem of AdaGrad.',
  },
  tags: ['optimization', 'adaptive'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

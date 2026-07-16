// 数值稳定 softmax · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-softmax-num-stable',
  categoryId: 'ml',
  title: { zh: '数值稳定 softmax', en: 'Numerically Stable Softmax' },
  summary: {
    zh: '减去最大值后再指数化，避免溢出。',
    en: 'Subtract max before exponentiating to avoid overflow.',
  },
  description: {
    zh: 'softmax(z)ᵢ = exp(zᵢ-max)/Σexp(zⱼ-max)。',
    en: 'softmax(z)ᵢ = exp(zᵢ-max)/Σexp(zⱼ-max).',
  },
  tags: ['ml', 'activation'],
  complexity: { time: 'O(k)', space: 'O(k)' },
};

// Tanh 激活 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-tanh-activation',
  categoryId: 'ml',
  title: { zh: 'Tanh 激活', en: 'Tanh Activation' },
  summary: { zh: '双曲正切，输出 (-1,1)。', en: 'Hyperbolic tangent, output in (-1,1).' },
  description: {
    zh: 'tanh(x)=(eˣ-e⁻ˣ)/(eˣ+e⁻ˣ)，零中心化，RNN 常用。',
    en: 'tanh(x)=(eˣ-e⁻ˣ)/(eˣ+e⁻ˣ); common in RNNs.',
  },
  tags: ['ml', 'activation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

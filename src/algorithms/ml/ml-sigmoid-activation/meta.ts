// Sigmoid 激活 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-sigmoid-activation',
  categoryId: 'ml',
  title: { zh: 'Sigmoid 激活', en: 'Sigmoid Activation' },
  summary: { zh: '将任意实数压缩到 (0,1)。', en: 'Squash any real to (0,1).' },
  description: {
    zh: 'σ(x)=1/(1+e⁻ˣ)，二分类输出层常用。',
    en: 'σ(x)=1/(1+e⁻ˣ); common in binary output layers.',
  },
  tags: ['ml', 'activation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

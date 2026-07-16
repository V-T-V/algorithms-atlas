// Leaky ReLU · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-leaky-relu',
  categoryId: 'ml',
  title: { zh: 'Leaky ReLU', en: 'Leaky ReLU Activation' },
  summary: { zh: '负半轴带微小斜率的 ReLU。', en: 'ReLU with small slope on the negative side.' },
  description: {
    zh: 'LeakyReLU(x)=x>0?x:αx，缓解神经元死亡。',
    en: 'LeakyReLU(x)=x>0?x:αx (α≈0.01); mitigates dead neurons.',
  },
  tags: ['ml', 'activation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

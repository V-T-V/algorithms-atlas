// TensorFlow Adam · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-tf-adam',
  categoryId: 'optimization',
  title: { zh: 'TensorFlow Adam', en: 'TensorFlow Adam (Keras)' },
  summary: {
    zh: 'TensorFlow/Keras 的 Adam 实现（默认 lr=0.001, eps=1e-7）。',
    en: 'TensorFlow/Keras Adam implementation (defaults lr=0.001, eps=1e-7).',
  },
  description: {
    zh: 'TensorFlow tf.keras.optimizers.Adam：默认 ε=1e-7（比 PyTorch 小 10×）。',
    en: 'TensorFlow tf.keras.optimizers.Adam: default ε=1e-7 (10× smaller than PyTorch).',
  },
  tags: ['optimization', 'framework', 'adam', 'tensorflow'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

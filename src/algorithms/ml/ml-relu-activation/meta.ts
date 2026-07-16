// ReLU 激活 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-relu-activation',
  categoryId: 'ml',
  title: { zh: 'ReLU 激活', en: 'ReLU Activation' },
  summary: { zh: '修正线性单元 max(0, x)。', en: 'Rectified Linear Unit max(0, x).' },
  description: {
    zh: 'ReLU(x)=max(0,x)，深度网络隐藏层主力。',
    en: 'ReLU(x)=max(0,x); dominant in deep nets.',
  },
  tags: ['ml', 'activation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

// 一维卷积层前向 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-neural-net-cnn',
  categoryId: 'ml',
  title: { zh: '一维卷积层前向', en: '1D Convolution Layer Forward' },
  summary: {
    zh: '一维卷积神经网络层的前向传播。',
    en: 'Forward pass of a 1D convolutional layer.',
  },
  description: {
    zh: '用多个卷积核滑过输入序列，每个位置求加权和+激活，输出特征图。',
    en: 'Multiple kernels slide over the input sequence producing weighted sums + activation.',
  },
  tags: ['ml', 'neural-network', 'cnn'],
  complexity: { time: 'O(k·L·c)', space: 'O(k·L)' },
};

// 训练/测试集划分 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-train-test-split',
  categoryId: 'ml',
  title: { zh: '训练/测试集划分', en: 'Train-Test Split' },
  summary: {
    zh: '随机划分数据为训练集与测试集。',
    en: 'Randomly split data into train and test sets.',
  },
  description: {
    zh: '按 testRatio 打乱后切分，可复现（seed）。',
    en: 'Shuffle by seed then split by testRatio.',
  },
  tags: ['ml', 'preprocessing'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

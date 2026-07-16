// K-Means++ 初始化 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-kmeans-init-pp',
  categoryId: 'ml',
  title: { zh: 'K-Means++ 初始化', en: 'K-Means++ Initialization' },
  summary: {
    zh: '按距离平方概率选取初始中心。',
    en: 'Pick initial centers with D² probability weighting.',
  },
  description: {
    zh: '第一个中心随机，后续按 D(x)²/ΣD² 概率选取。',
    en: 'First center random; later centers picked with probability D(x)²/ΣD².',
  },
  tags: ['ml', 'clustering'],
  complexity: { time: 'O(nkd)', space: 'O(kd)' },
};

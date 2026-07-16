// 均方根误差（Root Mean Square Error）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-rmse',
  categoryId: 'selection',
  title: { zh: '均方根误差', en: 'Root Mean Square Error' },
  summary: {
    zh: 'RMSE：sqrt(mean((xᵢ − μ)²))，即标准差。',
    en: 'RMSE: sqrt(mean((xᵢ − μ)²)), i.e., standard deviation.',
  },
  description: {
    zh: '均方根误差（相对均值的 RMSE 即标准差）衡量数据围绕均值的离散。',
    en: 'Root mean square error (RMSE about the mean equals the standard deviation) measures spread around the mean.',
  },
  tags: ['selection', 'statistics', 'rmse', 'std', 'spread'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

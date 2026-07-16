// 拉斯维加斯匹配 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-las-vegas-matching',
  categoryId: 'randomized',
  title: { zh: '拉斯维加斯匹配', en: 'Las Vegas Matching' },
  summary: {
    zh: '随机化求二分图完美匹配：Las Vegas 算法总给出正确答案，运行时间随机。',
    en: 'Randomized perfect matching in bipartite graphs: a Las Vegas algorithm always correct, random running time.',
  },
  description: {
    zh: 'Las Vegas 随机化匹配（基于 Tutte 矩阵思想的二分版本）：构造随机化矩阵，检查其行列式是否非零以判定完美匹配是否存在。本实现用简化随机增广路径法演示。',
    en: 'Las Vegas randomized matching (Tutte-matrix style for bipartite graphs): build a randomized matrix and test whether its determinant is nonzero to decide a perfect matching. This implementation demonstrates a simplified randomized augmenting-path approach.',
  },
  tags: ['randomized', 'las-vegas', 'bipartite-matching'],
  complexity: { time: 'O(V*E) 期望', space: 'O(V+E)' },
};

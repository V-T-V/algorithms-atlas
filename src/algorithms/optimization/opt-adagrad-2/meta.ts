// AdaGrad · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-adagrad-2',
  categoryId: 'optimization',
  title: { zh: 'AdaGrad', en: 'AdaGrad' },
  summary: {
    zh: 'AdaGrad：每个参数累计历史梯度平方，自适应降低学习率。',
    en: 'AdaGrad: per-parameter sum of squared gradients adaptively reduces learning rates.',
  },
  description: {
    zh: 'AdaGrad（Duchi 2011）：累积梯度平方和 v，学习率 = lr/√v。适合稀疏数据，但学习率单调下降可能过早停滞。',
    en: 'AdaGrad (Duchi 2011): accumulates squared gradients v; lr = lr/√v. Good for sparse data, but monotonic decay can stall early.',
  },
  tags: ['optimization', 'adaptive'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

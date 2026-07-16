// NAdam · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-nadam-2',
  categoryId: 'optimization',
  title: { zh: 'NAdam', en: 'NAdam' },
  summary: {
    zh: 'NAdam：把 Nesterov 动量思想融入 Adam，提前「向前看一步」更新。',
    en: 'NAdam: fuses Nesterov momentum into Adam, updating with a look-ahead gradient.',
  },
  description: {
    zh: 'NAdam（Dozat 2016）：Nesterov + Adam。在 Adam 框架下用未来位置的梯度近似，m̂ 中含前瞻项。',
    en: 'NAdam (Dozat 2016): Nesterov + Adam. Approximates the gradient at a future position within the Adam framework; m̂ includes a look-ahead term.',
  },
  tags: ['optimization', 'adam', 'nesterov'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

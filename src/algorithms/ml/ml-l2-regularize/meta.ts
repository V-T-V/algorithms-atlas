// L2 正则化项 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-l2-regularize',
  categoryId: 'ml',
  title: { zh: 'L2 正则化项', en: 'L2 Regularization Term' },
  summary: { zh: '权重 L2 范数平方的一半。', en: 'Half the squared L2 norm of weights.' },
  description: {
    zh: 'R(w)=½||w||²，加入损失项以约束权重大小。',
    en: 'R(w)=½||w||² added to loss to shrink weights.',
  },
  tags: ['ml', 'regularization'],
  complexity: { time: 'O(d)', space: 'O(1)' },
};

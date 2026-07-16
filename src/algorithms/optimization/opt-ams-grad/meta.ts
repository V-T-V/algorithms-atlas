// AMSGrad · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-ams-grad',
  categoryId: 'optimization',
  title: { zh: 'AMSGrad 优化器', en: 'AMSGrad Optimizer' },
  summary: {
    zh: '修正 Adam 单调性问题，保留历史最大二阶矩。',
    en: 'Fix Adam monotonicity by keeping the historical max of the second moment.',
  },
  description: {
    zh: 'AMSGrad 在 Adam 基础上维护 v̂ = max(v̂, v)，保证有效学习率非增，提升收敛性。',
    en: 'AMSGrad maintains v̂ = max(v̂, v) so the effective learning rate never increases.',
  },
  tags: ['optimization', 'adam', 'adaptive', 'first-order'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

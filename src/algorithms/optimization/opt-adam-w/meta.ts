// AdamW · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-adam-w',
  categoryId: 'optimization',
  title: { zh: 'AdamW', en: 'AdamW' },
  summary: {
    zh: 'AdamW：解耦权重衰减版的 Adam，正则化更稳。',
    en: 'AdamW: decoupled weight decay variant of Adam for more stable regularization.',
  },
  description: {
    zh: 'AdamW（Loshchilov & Hutter）：与 Adam 不同，把权重衰减直接作用在参数上而非梯度，避免自适应学习率与 L2 的耦合失真。',
    en: 'AdamW (Loshchilov & Hutter): unlike Adam, weight decay acts directly on parameters rather than gradients, avoiding the distortion from coupling L2 with adaptive learning rates.',
  },
  tags: ['optimization', 'adam', 'regularization'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

// PaddlePaddle Adam · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-paddle-opt',
  categoryId: 'optimization',
  title: { zh: 'PaddlePaddle Adam', en: 'PaddlePaddle Adam' },
  summary: {
    zh: '百度 PaddlePaddle 的 Adam 实现（默认 lr=0.001）。',
    en: 'Baidu PaddlePaddle Adam implementation (default lr=0.001).',
  },
  description: {
    zh: 'PaddlePaddle 的 Adam：与 PyTorch 类似，默认 β1=0.9, β2=0.999, ε=1e-8。',
    en: 'PaddlePaddle Adam: similar to PyTorch with defaults β1=0.9, β2=0.999, ε=1e-8.',
  },
  tags: ['optimization', 'framework', 'adam', 'paddle'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

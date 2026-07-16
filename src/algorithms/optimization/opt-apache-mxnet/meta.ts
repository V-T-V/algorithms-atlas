// MXNet Adam · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-apache-mxnet',
  categoryId: 'optimization',
  title: { zh: 'MXNet Adam', en: 'Apache MXNet Adam' },
  summary: {
    zh: 'Apache MXNet 框架的 Adam 实现（默认 lr=0.001, eps=1e-8）。',
    en: 'Apache MXNet framework Adam implementation (defaults lr=0.001, eps=1e-8).',
  },
  description: {
    zh: 'MXNet 的 Adam：标准 Adam 公式，默认 β1=0.9, β2=0.999, ε=1e-8。本实现用更大 lr 以便演示快速收敛。',
    en: 'MXNet Adam: standard Adam with defaults β1=0.9, β2=0.999, ε=1e-8. A larger lr is used here for fast demo convergence.',
  },
  tags: ['optimization', 'framework', 'adam', 'mxnet'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

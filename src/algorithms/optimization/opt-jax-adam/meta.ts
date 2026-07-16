// JAX Adam · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-jax-adam',
  categoryId: 'optimization',
  title: { zh: 'JAX Adam', en: 'JAX Adam (optax)' },
  summary: {
    zh: 'JAX/optax 的 Adam 实现（默认 lr=0.001, eps=1e-8）。',
    en: 'JAX/optax Adam implementation (defaults lr=0.001, eps=1e-8).',
  },
  description: {
    zh: 'JAX optax.adam：纯函数式 Adam，默认 eps 在根号外（与 PyTorch 同）。',
    en: 'JAX optax.adam: functional Adam with eps outside the sqrt (like PyTorch).',
  },
  tags: ['optimization', 'framework', 'adam', 'jax'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

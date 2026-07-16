// Brent 求根（Brent Root Finding）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-brent',
  categoryId: 'optimization',
  title: { zh: 'Brent 求根', en: 'Brent Root Finding' },
  summary: {
    zh: '结合二分与逆二次插值，保收敛且超线性，工程默认。',
    en: 'Combines bisection with inverse quadratic interpolation; robust and superlinear.',
  },
  description: {
    zh: 'Brent-Dekker：在保证区间收缩的前提下，优先用逆二次插值加速，避免导数。',
    en: 'Brent-Dekker: guaranteed bracketing with inverse quadratic interpolation when possible, no derivative.',
  },
  tags: ['optimization', 'root-finding'],
  complexity: { time: 'O(log(1/ε))', space: 'O(1)' },
};

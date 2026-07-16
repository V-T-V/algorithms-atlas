// rANS（rANS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-rans',
  categoryId: 'compression',
  title: { zh: 'rANS', en: 'rANS' },
  summary: {
    zh: 'rANS：基于状态 x = (x/M)*F(s) + s 的熵编码。',
    en: 'rANS: entropy coding via state x = (x/M)*F(s) + s.',
  },
  description: {
    zh: 'rANS（range Asymmetric Numeral Systems，Duda）用整数状态 x 编码：x_{n+1} = (x_n / M) * F(s) + (x_n mod M) - C(s)。逆序解码。',
    en: 'rANS (range Asymmetric Numeral Systems, Duda) uses integer state: x_{n+1} = (x_n / M) * F(s) + (x_n mod M) - C(s); decoded in reverse.',
  },
  tags: ['compression', 'ans', 'entropy', 'rans'],
  complexity: { time: 'O(n)', space: 'O(σ)' },
};

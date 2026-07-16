// 中国剩余定理（Chinese Remainder Theorem）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-chinese-remain',
  categoryId: 'misc',
  title: { zh: '中国剩余定理', en: 'Chinese Remainder Theorem' },
  summary: {
    zh: '求解同余方程组 x≡a_i mod n_i，要求模两两互素。',
    en: 'Solve x≡a_i mod n_i for pairwise-coprime moduli via CRT.',
  },
  description: {
    zh: 'CRT：x = Σ a_i · N_i · inv(N_i) mod N，N=Πn_i，N_i=N/n_i。模两两互素时有唯一解。',
    en: 'CRT: x = Σ a_i·N_i·inv(N_i) mod N, N=Πn_i. Unique solution when moduli are coprime.',
  },
  tags: ['misc', 'number-theory', 'modular'],
  complexity: { time: 'O(k log N)', space: 'O(1)' },
};

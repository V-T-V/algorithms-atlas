// Park-Miller · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-park-miller',
  categoryId: 'randomized',
  title: { zh: 'Park-Miller', en: 'Park-Miller MINSTD' },
  summary: { zh: 'Park-Miller 最小标准 LCG。', en: 'Park-Miller minimal standard LCG.' },
  description: {
    zh: 'x_{n+1} = 16807·x_n mod (2^31-1)。',
    en: 'x_{n+1} = 16807·x_n mod (2^31-1).',
  },
  tags: ['randomized', 'rng', 'lcg'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

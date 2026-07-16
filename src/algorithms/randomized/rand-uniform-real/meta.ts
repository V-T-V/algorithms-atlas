// 均匀实数采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-uniform-real',
  categoryId: 'randomized',
  title: { zh: '均匀实数采样', en: 'Uniform Real Sampling' },
  summary: { zh: '[lo,hi) 内均匀实数采样。', en: 'Uniform real sampling in [lo,hi).' },
  description: { zh: 'lo + uniform·(hi-lo)。', en: 'lo + uniform·(hi-lo).' },
  tags: ['randomized', 'distribution'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

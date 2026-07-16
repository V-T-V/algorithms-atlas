// 均匀整数采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-uniform-int',
  categoryId: 'randomized',
  title: { zh: '均匀整数采样', en: 'Uniform Integer Sampling' },
  summary: { zh: '[lo,hi] 内均匀整数采样。', en: 'Uniform integer sampling in [lo,hi].' },
  description: {
    zh: 'Math.floor(uniform·(hi-lo+1))+lo。',
    en: 'Math.floor(uniform·(hi-lo+1))+lo.',
  },
  tags: ['randomized', 'distribution'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

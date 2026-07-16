// Gamma 采样（Marsaglia-Tsang） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-gamma-marsaglia',
  categoryId: 'randomized',
  title: { zh: 'Gamma 采样（Marsaglia-Tsang）', en: 'Gamma Sampling (Marsaglia-Tsang)' },
  summary: {
    zh: 'Marsaglia-Tsang 方法产生 Gamma 分布。',
    en: 'Generate Gamma samples via Marsaglia-Tsang.',
  },
  description: { zh: '适用于 shape≥1。', en: 'Works for shape≥1.' },
  tags: ['randomized', 'distribution', 'gamma'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

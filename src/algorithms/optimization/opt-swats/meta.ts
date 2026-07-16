// SWATS · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-swats',
  categoryId: 'optimization',
  title: { zh: 'SWATS', en: 'SWATS' },
  summary: {
    zh: 'SWATS：Adam 起步，自适应切换到 SGD 以提升泛化。',
    en: 'SWATS: start with Adam, adaptively switch to SGD for better generalization.',
  },
  description: {
    zh: 'SWATS（Keskar & Socher 2017）：Adam 早期快速下降，达到切换条件后转为带动量 SGD，兼顾速度与泛化。',
    en: 'SWATS (Keskar & Socher 2017): Adam for fast early progress, then switch to momentum SGD when a criterion triggers, balancing speed and generalization.',
  },
  tags: ['optimization', 'adam', 'hybrid'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};

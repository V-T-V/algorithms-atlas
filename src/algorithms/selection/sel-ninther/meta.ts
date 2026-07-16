// Ninther 中位数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-ninther',
  categoryId: 'selection',
  title: { zh: 'Ninther 中位数', en: 'Ninther Median' },
  summary: {
    zh: '三段三数取中再取中位数，比 median-of-three 更稳健的 pivot。',
    en: 'Median of three median-of-threes; a more robust pivot than median-of-three.',
  },
  description: {
    zh: 'Ninther（Tukey）把数组分三段，每段取三数中位数，共得三个中位数，再取它们的中位数作为 pivot。相比 median-of-three 更能抑制偏斜输入。',
    en: 'The ninther (Tukey) splits the array into three segments, takes median-of-three in each, yielding three medians, then takes their median as the pivot. More resilient to skew than median-of-three.',
  },
  tags: ['selection', 'median', 'ninther', 'pivot-strategy'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

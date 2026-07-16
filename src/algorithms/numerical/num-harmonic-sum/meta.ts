// 调和级数部分和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-harmonic-sum',
  categoryId: 'numerical',
  title: { zh: '调和级数部分和', en: 'Harmonic Series Partial Sum' },
  summary: { zh: '计算前 n 项调和级数和 Hₙ。', en: 'Partial sum of the harmonic series Hₙ.' },
  description: { zh: 'Hₙ = 1 + 1/2 + 1/3 + ... + 1/n。', en: 'Hₙ = 1 + 1/2 + 1/3 + ... + 1/n.' },
  tags: ['numerical', 'series'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

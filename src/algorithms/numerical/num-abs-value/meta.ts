// 绝对值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-abs-value',
  categoryId: 'numerical',
  title: { zh: '绝对值', en: 'Absolute Value' },
  summary: { zh: '返回数的绝对值。', en: 'Return the absolute value of a number.' },
  description: { zh: '|x| = x≥0 ? x : -x。', en: '|x| = x≥0 ? x : -x.' },
  tags: ['numerical', 'arithmetic'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

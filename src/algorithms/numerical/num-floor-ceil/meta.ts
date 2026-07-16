// 向下/向上取整 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-floor-ceil',
  categoryId: 'numerical',
  title: { zh: '向下/向上取整', en: 'Floor and Ceiling' },
  summary: {
    zh: '返回不超过/不小于 x 的最大/最小整数。',
    en: 'Largest int ≤ x / smallest int ≥ x.',
  },
  description: { zh: '⌊x⌋ 向下，⌈x⌉ 向上。', en: '⌊x⌋ floor; ⌈x⌉ ceiling.' },
  tags: ['numerical', 'arithmetic'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

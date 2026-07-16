// TimSort v2 (galloping merge) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tim-sort2',
  categoryId: 'sorting',
  title: { zh: 'Tim排序v2（galloping 归并）', en: 'TimSort v2 (galloping merge)' },
  summary: {
    zh: 'Tim排序v2（galloping 归并）属于sorting类别。',
    en: 'TimSort v2 (galloping merge) is a sorting algorithm.',
  },
  description: {
    zh: 'Tim排序v2（galloping 归并）（TimSort v2 (galloping merge)）属于sorting类别的算法。',
    en: 'TimSort v2 (galloping merge) is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

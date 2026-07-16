// 精确率与召回率 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-precision-recall',
  categoryId: 'ml',
  title: { zh: '精确率与召回率', en: 'Precision and Recall' },
  summary: {
    zh: '二分类的精确率与召回率。',
    en: 'Precision and recall for binary classification.',
  },
  description: {
    zh: 'Precision=TP/(TP+FP)，Recall=TP/(TP+FN)。',
    en: 'Precision=TP/(TP+FP), Recall=TP/(TP+FN).',
  },
  tags: ['ml', 'evaluation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

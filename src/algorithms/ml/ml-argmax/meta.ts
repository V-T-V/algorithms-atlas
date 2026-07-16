// Argmax · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-argmax',
  categoryId: 'ml',
  title: { zh: 'Argmax', en: 'Argmax' },
  summary: { zh: '返回数组最大值的索引。', en: 'Return the index of the maximum value.' },
  description: {
    zh: 'softmax 输出转类别预测的常用步骤。',
    en: 'Common step to convert softmax output to a class prediction.',
  },
  tags: ['ml', 'inference'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

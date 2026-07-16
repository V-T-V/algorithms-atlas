// 准确率 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-accuracy-score',
  categoryId: 'ml',
  title: { zh: '准确率', en: 'Accuracy Score' },
  summary: { zh: '分类正确预测比例。', en: 'Fraction of correctly classified samples.' },
  description: { zh: 'accuracy = 正确数 / 总数。', en: 'accuracy = #correct / #total.' },
  tags: ['ml', 'evaluation', 'classification'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

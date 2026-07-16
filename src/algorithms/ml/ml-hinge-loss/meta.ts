// 合页损失 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-hinge-loss',
  categoryId: 'ml',
  title: { zh: '合页损失', en: 'Hinge Loss' },
  summary: { zh: 'SVM 的合页损失 max(0, 1 - y·ŷ)。', en: 'SVM hinge loss max(0, 1 - y·ŷ).' },
  description: {
    zh: '当 y·ŷ ≥ 1 时损失为 0，否则 1 - y·ŷ。',
    en: 'Zero when y·ŷ ≥ 1, else 1 - y·ŷ.',
  },
  tags: ['ml', 'loss', 'svm'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

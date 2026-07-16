// 决定系数 R² · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-r2-score',
  categoryId: 'ml',
  title: { zh: '决定系数 R²', en: 'R-squared Score' },
  summary: { zh: '回归拟合优度：1 - SS_res/SS_tot。', en: 'Goodness of fit: 1 - SS_res/SS_tot.' },
  description: {
    zh: 'R²=1 完美，=0 等于均值，<0 比均值差。',
    en: 'R²=1 perfect, =0 equals mean, <0 worse than mean.',
  },
  tags: ['ml', 'evaluation', 'regression'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

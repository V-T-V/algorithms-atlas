// 前向检查（Forward Checking）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-forward-checking',
  categoryId: 'ai-search',
  title: { zh: '前向检查', en: 'Forward Checking' },
  summary: {
    zh: 'CSP 中提前删除未来变量的非法值。',
    en: 'Prunes future variables illegal values early.',
  },
  description: {
    zh: '前向检查在给某变量赋值后，立即从其邻居(未来变量)域中删除与之冲突的值，更早发现死路。',
    en: 'Forward checking removes conflicting values from neighbor domains immediately after assignment, detecting dead-ends earlier.',
  },
  tags: ['ai-search', 'csp', 'forward-checking'],
  complexity: { time: 'O(d^n)', space: 'O(nd)' },
};

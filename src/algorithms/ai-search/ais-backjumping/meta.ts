// 冲突导向回跳（Conflict-Directed Backjumping）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-backjumping',
  categoryId: 'ai-search',
  title: { zh: '冲突导向回跳', en: 'Conflict-Directed Backjumping' },
  summary: {
    zh: 'CSP 回溯时跳到真正的冲突变量。',
    en: 'Backtracks CSP to the true conflict variable.',
  },
  description: {
    zh: '冲突导向回跳(CBJ)在 CSP 求解中当某变量无解时，回溯到引起冲突的最近变量而非直接前驱，减少无效搜索。',
    en: 'Conflict-directed backjumping jumps to the variable actually causing a conflict instead of the immediate predecessor.',
  },
  tags: ['ai-search', 'csp', 'backjumping'],
  complexity: { time: 'O(d^n)', space: 'O(n)' },
};

// Anytime A*（Anytime A*）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-anytime-a-star',
  categoryId: 'ai-search',
  title: { zh: 'Anytime A*', en: 'Anytime A*' },
  summary: {
    zh: '在时限内先给可行解再逐步优化。',
    en: 'Produces a feasible solution then improves under a time budget.',
  },
  description: {
    zh: 'Anytime A*(如 ARA*)用递减的启发式膨胀系数 ε，先快速得到次优解，再逐步逼近最优，适合实时系统。',
    en: 'Anytime A* (e.g. ARA*) uses a decreasing inflation ε to quickly return a suboptimal solution then refine toward optimal.',
  },
  tags: ['ai-search', 'anytime', 'heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(n)' },
};

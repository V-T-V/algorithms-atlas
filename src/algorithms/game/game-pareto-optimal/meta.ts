// 帕累托最优 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-pareto-optimal',
  categoryId: 'game',
  title: { zh: '帕累托最优', en: 'Pareto Optimality' },
  summary: {
    zh: '识别收益空间中不被任何结果同时改进的帕累托前沿。',
    en: 'Identify the Pareto frontier: outcomes not dominated by any other in all coordinates.',
  },
  description: {
    zh: '帕累托最优识别。给定 2x2 收益组合，标记所有帕累托有效结果。\n示例矩阵：\n      A      B\n  A  3,3    5,1\n  B  1,5    4,4\n帕累托前沿：通常含 (5,1)、(1,5)、(4,4)（无其它格同时改进）。',
    en: 'Pareto optimality. Given 2x2 payoffs, mark all Pareto-efficient outcomes.\nExample:\n      A      B\n  A  3,3    5,1\n  B  1,5    4,4\nPareto frontier: typically (5,1), (1,5), (4,4) (no cell dominates them).',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

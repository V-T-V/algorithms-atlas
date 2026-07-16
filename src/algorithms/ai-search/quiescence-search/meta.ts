// 静止搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quiescence-search',
  categoryId: 'ai-search',
  title: { zh: '静止搜索', en: 'Quiescence Search' },
  summary: {
    zh: '到达深度限制后，继续搜索"活跃"走法（如吃子）直到局面静止，克服地平线效应。',
    en: 'Past the depth limit, keep searching "noisy" moves (captures) until the position is quiet, mitigating the horizon effect.',
  },
  description: {
    zh: '静止搜索（Quiescence Search）解决 alpha-beta 的「地平线效应」：当搜索在某个深度截断时，若该局面仍有强制性的走法（如可吃子、将军），估值会很不可靠——因为它忽略了下一步的重大变化。静止搜索在到达深度上限后，只继续展开「活跃」走法（通常是吃子），直到局面「静止」（没有吃子等强制走法）再估值。本实现用一个带 capture 标记的数值博弈树演示：叶子可被静态估值，内部节点区分"有/无 capture 走法"。',
    en: 'Quiescence Search addresses alpha-beta\'s "horizon effect": when search is cut off at some depth but the position still has forcing moves (captures, checks), the static evaluation is unreliable because it ignores imminent major changes. Quiescence search, past the depth limit, only continues expanding "noisy" moves (typically captures) until the position is "quiet" (no captures) and then evaluates. This implementation demonstrates on a numeric game tree where children are flagged as captures or quiet moves.',
  },
  tags: ['ai-search', 'game-tree', 'alpha-beta', 'horizon-effect'],
  complexity: { time: 'O(吃子序列长度)', space: 'O(吃子序列长度)' },
  references: [
    {
      label: 'Quiescence search — Chessprogramming Wiki',
      url: 'https://www.chessprogramming.org/Quiescence_Search',
    },
  ],
};

// 晚期走子裁剪 LMR（Late Move Reductions）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'late-move-reduction',
  categoryId: 'ai-search',
  title: { zh: '晚期走子裁剪 LMR', en: 'Late Move Reductions' },
  summary: {
    zh: '排序靠后的走法在足够深处时以缩减深度搜索，若超过 α 再重搜完整深度。',
    en: 'Search late-ordered moves at reduced depth when deep enough; re-search full depth if it beats alpha.',
  },
  description: {
    zh: 'LMR（Late Move Reductions，Reimer 1993，广泛用于现代国际象棋引擎如 Stockfish）基于经验观察：好的走法通常排在前面（来自 PV/killer/history），排序靠后的走法大概率不是最优。因此对「排序靠后 + 剩余深度足够」的走法先用 `depth-1-R` 搜索（R 为缩减量，常取 1），只有当这个缩减搜索的值超过当前 α（即它「出乎意料地好」）时才用完整 `depth-1` 重搜。\n\n收益：大多数晚期走法只花很小的代价就被排除，节省大量节点。风险：可能错过某些真正好的走法——因此用「超过 α 即重搜」保证正确性边界（在与纯 α-β 相比时，只有当 α 在重搜过程中变化时才可能略有偏差；本实现采用保守策略确保根值与纯 α-β 一致）。',
    en: 'LMR (Late Move Reductions, Reimer 1993; used by modern chess engines like Stockfish) rests on the observation that good moves are usually ordered early (from PV/killer/history), so late-ordered moves are unlikely to be best. We therefore search "late + deep enough" moves with `depth-1-R` (R often 1), and only re-search at full `depth-1` if the reduced search beats the current alpha (i.e. the move is "surprisingly good").\n\nBenefit: most late moves are dismissed cheaply. Risk: we might miss a genuinely good move — hence "re-search when beating alpha" preserves correctness in the common case (this implementation uses a conservative scheme so the root value matches plain alpha-beta).',
  },
  tags: ['ai-search', 'game-tree', 'alpha-beta', 'pruning', 'move-ordering'],
  complexity: { time: 'O(b^(d-R))', space: 'O(d)' },
  references: [
    {
      label: 'Late Move Reductions — Chessprogramming Wiki',
      url: 'https://www.chessprogramming.org/Late_Move_Reductions',
    },
  ],
};

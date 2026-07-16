// 历史启发（History Heuristic）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'history-heuristic',
  categoryId: 'ai-search',
  title: { zh: '历史启发', en: 'History Heuristic' },
  summary: {
    zh: '记录每个走法引发剪枝的次数，优先搜索「历史得分高」的走法以加速 α-β。',
    en: 'Track how often each move causes a cutoff, searching high-scoring moves first to speed up alpha-beta.',
  },
  description: {
    zh: '历史启发（Schaeffer, 1983）用一个全局的 `history[from][to]` 计分表记录「曾经引发 β 剪枝的走法」。\n\n机制：\n1. 在 α-β 搜索中，每当一个走法触发剪枝，就把 `history[from][to] += depth²`（深度越深，剪枝价值越大）。\n2. 在展开一个内部节点时，先按 `history` 得分对子节点降序排序再搜索。\n\n与 killer-move 不同，history 表是全局的（不分层），因此能跨不同位置复用经验；它捕捉「这一类走法（如吃子、将军）通常很好」的统计规律。本实现在带 moveId 的通用数值博弈树上工作，并与纯 α-β 对照，二者返回相同根值。',
    en: 'The history heuristic (Schaeffer, 1983) maintains a global `history[from][to]` table counting moves that have caused beta cutoffs.\n\nMechanism:\n1. In alpha-beta, whenever a move triggers a cutoff, increment `history[from][to] += depth²` (deeper cutoffs are worth more).\n2. When expanding an internal node, sort children by descending `history` score before searching.\n\nUnlike killer moves, the history table is global (not per-ply), so it reuses experience across different positions; it captures the statistical fact that "this kind of move (e.g. captures, checks) is usually good." This implementation works on a generic numeric game tree with moveIds and matches plain alpha-beta at the root.',
  },
  tags: ['ai-search', 'game-tree', 'alpha-beta', 'move-ordering', 'heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(b·d)' },
  references: [
    {
      label: 'History heuristic — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/History_heuristic',
    },
  ],
};

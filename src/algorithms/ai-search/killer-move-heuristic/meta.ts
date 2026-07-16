// 杀手棋启发 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'killer-move-heuristic',
  categoryId: 'ai-search',
  title: { zh: '杀手棋启发', en: 'Killer Move Heuristic' },
  summary: {
    zh: '记录同层引起剪枝的走法，在兄弟节点优先尝试，加速 alpha-beta。',
    en: 'Record moves that caused cutoffs at a ply and try them first in siblings to speed up alpha-beta.',
  },
  description: {
    zh: '杀手棋启发（Killer Move Heuristic）是 alpha-beta 的走法排序增强。经验观察：在同一层（ply）中，若某走法在兄弟节点引起了剪枝，它在其它兄弟节点也很可能引起剪枝——因为兄弟局面非常相似。因此维护一个「每层 K 个杀手棋」表，搜索时优先尝试这些走法。理想情况下，第一个尝试的走法就触发剪枝，使该节点只需扩展 1 个子节点而非全部。本实现提供带 killer 表的 alpha-beta，结果与普通 alpha-beta 完全一致。',
    en: 'The Killer Move Heuristic is a move-ordering enhancement for alpha-beta. Empirical observation: if a move caused a cutoff at a given ply in one node, it is likely to cause a cutoff in sibling nodes too, since their positions are very similar. We keep a table of "K killer moves per ply" and try them first. In the ideal case the first tried move triggers a cutoff, expanding only one child instead of all. This implementation provides an alpha-beta with a killer table, producing results identical to plain alpha-beta.',
  },
  tags: ['ai-search', 'game-tree', 'alpha-beta', 'heuristic', 'move-ordering'],
  complexity: { time: 'O(b^d)', space: 'O(d·K)' },
  references: [
    {
      label: 'Killer move heuristic — Chessprogramming Wiki',
      url: 'https://www.chessprogramming.org/Killer_Heuristic',
    },
  ],
};

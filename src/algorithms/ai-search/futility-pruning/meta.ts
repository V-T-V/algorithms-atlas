// 无用走子裁枝（Futility Pruning）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'futility-pruning',
  categoryId: 'ai-search',
  title: { zh: '无用走子裁枝', en: 'Futility Pruning' },
  summary: {
    zh: '在前沿节点（深度 1）若静态评估 + 边际 ≤ α，则该走法不大可能改善 α，直接剪。',
    en: 'At frontier nodes (depth 1), if static eval + margin <= alpha the move is unlikely to raise alpha, so prune it.',
  },
  description: {
    zh: '无用走子裁枝（futility pruning）针对前沿节点（剩余深度 = 1）：在展开某节点的子节点前，先计算其静态评估值 `staticEval`。若 `staticEval + futilityMargin ≤ α`，说明即便走这一步也很可能不会超过当前 α，可以安全地不深入搜索（直接以静态评估返回近似值）。\n\n扩展：**扩展无用走子裁枝（Extended Futility Pruning）** 在深度 2、3 也用更大的边际。\n\n这是有损剪枝（may miss some tactical lines），但工程上非常有效。本实现在数值博弈树上工作，禁用时退化为纯 α-β（根值严格一致）。',
    en: "Futility pruning targets frontier nodes (remaining depth = 1): before expanding a node's children, compute its static eval. If `staticEval + futilityMargin <= alpha`, even this move is unlikely to beat the current alpha, so we can safely skip the deep search and return the static eval as an approximation.\n\nExtension: Extended Futility Pruning applies larger margins at depth 2 and 3.\n\nThis is a lossy pruning (may miss some tactics) but extremely effective in practice. This implementation works on a numeric game tree; when disabled it reduces to plain alpha-beta (root value strictly identical).",
  },
  tags: ['ai-search', 'game-tree', 'alpha-beta', 'pruning', 'frontier'],
  complexity: { time: 'O(b^(d-1))', space: 'O(d)' },
  references: [
    {
      label: 'Futility Pruning — Chessprogramming Wiki',
      url: 'https://www.chessprogramming.org/Futility_Pruning',
    },
  ],
};

// 象棋残局 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-chess-endgame',
  categoryId: 'game',
  title: { zh: '象棋残局（将军最短步数）', en: 'Chess Endgame (Mate in N)' },
  summary: {
    zh: '极小极大求在受限局面下先手将杀对方所需的最少步数。',
    en: 'Minimax to find the minimum moves to checkmate in a constrained endgame.',
  },
  description: {
    zh: '把残局抽象为状态图：先手攻击方寻找最短将杀路径，防守方尽力拖延。用迭代加深 minimax 求 mate-in-N。',
    en: 'Model the endgame as a state graph: the attacker seeks the shortest forced mate, the defender delays. Iterative-deepening minimax yields mate-in-N.',
  },
  tags: ['game', 'minimax', 'chess'],
  complexity: { time: 'O(分支^N)', space: 'O(N)' },
};

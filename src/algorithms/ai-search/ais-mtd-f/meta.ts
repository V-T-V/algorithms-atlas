// MTD(f) 算法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-mtd-f',
  categoryId: 'ai-search',
  title: { zh: 'MTD(f) 算法', en: 'MTD(f) Algorithm' },
  summary: {
    zh: 'MTD(f)：反复用零窗口 alpha-beta + 转置换表，以初始猜测 f 逼近博弈值。',
    en: 'MTD(f): repeatedly call zero-window alpha-beta with a transposition table, driving an initial guess f toward the game value.',
  },
  description: {
    zh: 'MTD(f)（Plaat, 1996）是高效的极小化博弈搜索算法。它反复调用「零窗口」（α=β-1）的 alpha-beta 搜索（也称 Test），每次返回一个上界或下界，结合转置表收敛到真实博弈值。所需 Test 次数为 O(log(值域))。初始猜测 f 越准收敛越快（常用上轮迭代加深的值）。MTD(f) 在许多游戏中比传统 alpha-beta 展开更少节点。本实现在数值博弈树上演示，Test 用带上下界的 negamax。',
    en: 'MTD(f) (Plaat, 1996) is an efficient minimax game-search algorithm. It repeatedly calls "zero-window" (α=β-1) alpha-beta search (also called Test); each call returns an upper or lower bound, and combined with a transposition table it converges to the true game value. The number of Test calls is O(log(value range)). A better initial guess f speeds convergence (often the previous iterative-deepening value). MTD(f) expands fewer nodes than plain alpha-beta in many games. This implementation demonstrates on numeric game trees; Test uses bounded negamax.',
  },
  tags: ['ai-search', 'mtd', 'alpha-beta', 'zero-window', 'transposition'],
  complexity: { time: 'O(b^d)', space: 'O(b^d)' },
};

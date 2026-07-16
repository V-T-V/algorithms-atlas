// Nim 游戏变种 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-nim-game-alt',
  categoryId: 'misc',
  title: { zh: 'Nim 游戏变种', en: 'Nim Game Variant' },
  summary: {
    zh: '一堆石子 n 个，每次取 1..k 个，取走最后一个者胜，求先手是否必胜。',
    en: 'A pile of n stones, take 1..k each turn, last move wins; determine if the first player has a winning strategy.',
  },
  description: {
    zh: 'Nim 游戏变种（减法游戏，LeetCode 292 推广）：\n\n- 一堆 n 个石子，两名玩家轮流取 1..k 个，取走最后石子者胜。\n- 必胜条件：n % (k+1) != 0 时先手必胜。\n- 策略：先手取 n % (k+1) 个，之后每次取 (k+1 - 对方取数)，保持每轮合计 (k+1)。\n- 若 n 是 (k+1) 倍数，先手必败。',
    en: 'Nim variant (subtraction game, generalizing LeetCode 292):\n\n- A pile of n stones; two players take 1..k each turn; the player taking the last stone wins.\n- First player wins iff n % (k+1) != 0.\n- Strategy: take n % (k+1), then mirror the opponent to keep each round summing to (k+1).\n- If n is a multiple of (k+1), the first player loses.',
  },
  tags: ['misc', 'game-theory', 'math'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

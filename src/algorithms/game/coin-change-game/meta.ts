// 取硬币博弈（Coin-Change Game）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'coin-change-game',
  categoryId: 'game',
  title: { zh: '取硬币博弈', en: 'Coin-Change Game' },
  summary: {
    zh: '面对 n 枚硬币每次取 1..m 枚，取最后一枚者胜（SG/Bash 定理）。',
    en: 'Take 1..m coins from a pile of n; taker of the last coin wins (SG/Bash).',
  },
  description: {
    zh: '一堆共 n 枚硬币，两名玩家轮流取，每次可取 1 到 m 枚，取走最后一枚者获胜（正常玩法）。这是经典 SG 定理（也称巴什博弈 Bash Game）的最简实例。\n\n结论：当 (n mod (m+1)) != 0 时，先手必胜——先手取 n mod (m+1) 枚，使剩余硬币数成为 (m+1) 的倍数；之后无论对手取 k 枚（1<=k<=m），先手都取 (m+1-k) 枚，始终保持剩余为 (m+1) 的倍数，最终取走最后一枚。当 (n mod (m+1)) == 0 时，先手必败。\n\n本实现用 SG 值（mex）逐状态计算并验证上述结论，给出必胜取法。',
    en: 'A pile of n coins; two players alternate taking 1..m coins each turn; the player taking the last coin wins (normal play). This is the simplest instance of the SG theorem (a.k.a. Bash Game).\n\nResult: when (n mod (m+1)) != 0 the first player wins — take n mod (m+1) coins first to leave a multiple of (m+1); thereafter, whatever the opponent takes (k coins), take (m+1-k) coins, keeping the remainder a multiple of (m+1) and eventually taking the last coin. When (n mod (m+1)) == 0 the first player loses.\n\nThis implementation computes SG values via mex to verify the theorem and gives the winning move.',
  },
  tags: ['game', 'sg-theorem', 'bash-game', 'combinatorial'],
  complexity: { time: 'O(n·m)', space: 'O(n)' },
  defaultInput: { n: 10, m: 4 },
};

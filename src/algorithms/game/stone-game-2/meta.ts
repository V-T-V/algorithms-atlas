// 石子游戏 II（Stone Game II, LeetCode 1140）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stone-game-2',
  categoryId: 'game',
  title: { zh: '石子游戏 II', en: 'Stone Game II' },
  summary: {
    zh: '可取 1..2M 堆，M 动态变化，求先手最大石子数（记忆化 DP）。',
    en: "Take 1..2M piles, M changes dynamically; find first player's max stones (memoized DP).",
  },
  description: {
    zh: '石子排成一排，piles[i] 为第 i 堆的石子数。Alice 先手。规则：在当前回合，玩家可以取走接下来的 X 堆，其中 1 <= X <= 2M；取完后 M 更新为 max(M, X)。初始 M=1。玩家都想最大化自己的石子总数。求 Alice 能拿到的最多石子数。\n\n用记忆化搜索：f(i, M) 表示从第 i 堆开始、当前 M 值时，当前玩家能比对手多拿的石子数。转移：枚举 X=1..2M，f(i,M) = max( sum(i..i+X-1) - f(i+X, max(M,X)) )。最终 Alice 的石子数 = (total + f(0,1)) / 2。',
    en: "Stones in a row, piles[i] = stones in pile i. Alice first. Each turn the player may take the next X piles, 1 <= X <= 2M; afterwards M becomes max(M, X). Initially M=1. Each player maximizes their own total stones. Find the most stones Alice can get.\n\nMemoized search: f(i, M) = the extra stones the current player can take over the opponent starting from pile i with current M. Transition: try X=1..2M, f(i,M) = max( sum(i..i+X-1) - f(i+X, max(M,X)) ). Alice's stones = (total + f(0,1)) / 2.",
  },
  tags: ['game', 'dp', 'memoization', 'prefix-sum'],
  complexity: { time: 'O(n²·M)', space: 'O(n·M)' },
  references: [{ label: 'LeetCode 1140', url: 'https://leetcode.com/problems/stone-game-ii/' }],
  defaultInput: [2, 7, 9, 4, 4],
};

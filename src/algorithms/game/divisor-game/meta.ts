// 除数博弈（Divisor Game）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'divisor-game',
  categoryId: 'game',
  title: { zh: '除数博弈', en: 'Divisor Game' },
  summary: {
    zh: 'N 上选真因数 x 使 N 减 x，先到 1 者胜（Alice 先手）。',
    en: 'Pick a proper divisor x of N, N -= x; first to reach 1 wins (Alice first).',
  },
  description: {
    zh: 'Alice 和 Bob 轮流游戏，给定数字 N：当前玩家选择一个 N 的真因数 x（满足 0 < x < N 且 N mod x = 0），用 N 替换为 N - x。把 N 变成 1 的玩家获胜（即轮到 N=1 时该玩家无法操作而失败）。Alice 先手。\n\n结论（可由 DP 证明）：当且仅当 N 为偶数时 Alice 必胜。直觉：Alice 总可以选 x=1，把奇数留给 Bob；Bob 拿到奇数 N，其所有真因数都是奇数，N-x 必为偶数，又把偶数还给 Alice。最终 Alice 拿到 2 选 1 → Bob 拿到 1 输。\n\n本实现用 DP 模拟博弈：dp[i]=true 表示 i 时当前玩家必胜，dp[i] = 任存在 i 的因数 x 使 dp[i-x]=false。',
    en: 'Alice and Bob alternate. Given N, the current player chooses a proper divisor x of N (0 < x < N, N mod x = 0) and replaces N by N - x. The player who turns N into 1 wins (i.e. facing N=1 loses). Alice goes first.\n\nResult (provable by DP): Alice wins if and only if N is even. Intuition: Alice always picks x=1, leaving Bob an odd number; Bob, facing odd N, has only odd proper divisors, so N-x is even, returning an even number to Alice. Eventually Alice gets 2, picks 1, and Bob faces 1 and loses.\n\nThis implementation simulates the game with DP: dp[i]=true means the player to move on i wins; dp[i] = exists a divisor x of i with dp[i-x]=false.',
  },
  tags: ['game', 'dp', 'number-theory'],
  complexity: { time: 'O(n·sqrt(n))', space: 'O(n)' },
  references: [{ label: 'LeetCode 1025', url: 'https://leetcode.com/problems/divisor-game/' }],
  defaultInput: 8,
};

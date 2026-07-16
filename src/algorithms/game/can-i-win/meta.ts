// 我能赢吗（Can I Win, LeetCode 464）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'can-i-win',
  categoryId: 'game',
  title: { zh: '我能赢吗', en: 'Can I Win' },
  summary: {
    zh: '从 1..maxChoose 选数累加，先到 desiredTotal 者胜（状压记忆化）。',
    en: 'Pick numbers from 1..maxChoose to reach desiredTotal first (bitmask memo).',
  },
  description: {
    zh: '两名玩家轮流从 1 到 maxChoosableInteger 中选一个尚未被选的整数加到累计和上，使累计和 >= desiredTotal 的玩家获胜。整数不能重复选。判断先手玩家是否能保证获胜（双方都最优）。\n\n状态压缩 + 记忆化搜索：用位掩码 state 表示哪些数已被选；dfs(state, remaining) 返回当前玩家能否赢。转移：枚举可选的数 x，若 x >= remaining 则直接赢；否则若 dfs(state | (1<<x), remaining-x) 为 false（对手输了）则当前玩家赢。',
    en: 'Two players alternate picking an unused integer from 1..maxChoosableInteger, adding it to a running total. The player who makes the total >= desiredTotal wins. Integers cannot be reused. Determine whether the first player can force a win (both play optimally).\n\nBitmask + memoized search: a bitmask encodes which numbers are used; dfs(state, remaining) returns whether the current player can win. Transition: for each available x, if x >= remaining win immediately; else if dfs(state | (1<<x), remaining-x) is false (opponent loses) then current player wins.',
  },
  tags: ['game', 'dp', 'bitmask', 'memoization'],
  complexity: { time: 'O(2^m · m)', space: 'O(2^m)' },
  references: [{ label: 'LeetCode 464', url: 'https://leetcode.com/problems/can-i-win/' }],
  defaultInput: { maxChoosableInteger: 10, desiredTotal: 11 },
};

// 跳跃游戏 II（Jump Game II）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jump-game-2',
  categoryId: 'greedy',
  title: { zh: '跳跃游戏 II', en: 'Jump Game II' },
  summary: {
    zh: '每格可跳 1..nums[i] 步，求到达终点的最少跳跃次数（贪心 BFS）。',
    en: 'Each cell allows 1..nums[i] jumps; minimum jumps to reach the end (greedy BFS).',
  },
  description: {
    zh: '给定非负整数数组 nums，初始位于第 0 格，nums[i] 表示从该格最多可跳的步数。假设总是可达终点，求到达最后一格的最少跳跃次数。\n\n贪心（隐式 BFS / 层次遍历）：维护「当前一跳能覆盖的区间 [l, r]」与「下一跳能覆盖的最远边界 nextEnd」。扫描 i 在 [l, r] 内，更新 nextEnd = max(nextEnd, i + nums[i])；当 i 扫到 r 时，说明当前层的所有格子已处理完，必须再跳一次进入下一层（l = r+1, r = nextEnd），跳跃数 +1。直到 r 覆盖终点。O(n)。',
    en: 'Given a non-negative array nums, start at index 0, nums[i] = max jump length from that cell. Assuming the end is always reachable, find the minimum number of jumps to reach the last index.\n\nGreedy (implicit BFS / level order): maintain "the range of the current jump [l, r]" and "the farthest edge of the next jump nextEnd". Scan i within [l, r], updating nextEnd = max(nextEnd, i + nums[i]); when i reaches r, the current layer is exhausted — take one more jump (l = r+1, r = nextEnd), increment jump count. Repeat until r covers the end. O(n).',
  },
  tags: ['greedy', 'array', 'bfs'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  references: [{ label: 'LeetCode 45', url: 'https://leetcode.com/problems/jump-game-ii/' }],
  defaultInput: [2, 3, 1, 1, 4],
};

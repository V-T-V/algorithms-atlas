// 跳跃游戏（Jump Game, 贪心版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jump-game-g',
  categoryId: 'greedy',
  title: { zh: '跳跃游戏（贪心）', en: 'Jump Game (Greedy)' },
  summary: {
    zh: '每格可跳 1..nums[i] 步，判断能否到达终点（贪心维护最远可达）。',
    en: 'Each cell allows 1..nums[i] jumps; can you reach the end? (greedy max-reach)',
  },
  description: {
    zh: '给定非负整数数组 nums，初始位于第 0 格，每格上的数字代表从该格最多可跳的步数。判断能否到达最后一格。\n\n贪心：维护「当前能到达的最远位置 maxReach」。从左到右扫描，若当前位置 i 在 maxReach 内（i <= maxReach），就更新 maxReach = max(maxReach, i + nums[i])；一旦 maxReach >= 最后一格则可达。若扫描到 i > maxReach 则中途断链、不可达。一次遍历 O(n)。',
    en: 'Given a non-negative array nums, you start at index 0; nums[i] is the maximum jump length from that cell. Determine whether you can reach the last index.\n\nGreedy: maintain "the farthest reachable position maxReach". Scan left to right; if i <= maxReach, update maxReach = max(maxReach, i + nums[i]); once maxReach >= last index, it is reachable. If we hit i > maxReach the chain is broken. Single pass O(n).',
  },
  tags: ['greedy', 'array'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  references: [{ label: 'LeetCode 55', url: 'https://leetcode.com/problems/jump-game/' }],
  defaultInput: [2, 3, 1, 1, 4],
};

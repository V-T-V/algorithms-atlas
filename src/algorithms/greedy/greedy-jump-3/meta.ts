// 跳跃游戏（能否到达） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-jump-3',
  categoryId: 'greedy',
  title: { zh: '跳跃游戏（能否到达）', en: 'Jump Game (Reachable)' },
  summary: {
    zh: '维护当前能到达的最远位置 maxReach，逐位扫描。',
    en: 'Maintain the furthest reachable index maxReach; scan left to right.',
  },
  description: {
    zh: 'LeetCode 55 跳跃游戏：nums[i] 表示在该位最多跳几步，问能否到达终点。维护 maxReach = max(maxReach, i+nums[i])。',
    en: 'LeetCode 55 Jump Game: nums[i] = max jump from i; can you reach the last index? Maintain maxReach = max(maxReach, i + nums[i]).',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

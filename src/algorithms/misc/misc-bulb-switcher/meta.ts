// 灯泡开关 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-bulb-switcher',
  categoryId: 'misc',
  title: { zh: '灯泡开关', en: 'Bulb Switcher' },
  summary: {
    zh: 'n 个灯泡，第 i 轮切换每 i 个灯泡，求 n 轮后亮灯数（LeetCode 319）。',
    en: 'n bulbs toggled every i-th step on round i; find how many are on after n rounds (LeetCode 319).',
  },
  description: {
    zh: 'LeetCode 319 灯泡开关：\n\n- 第 1 轮全开，第 2 轮切换 2 的倍数，...，第 k 轮切换 k 的倍数。\n- 一个灯泡最终亮 <=> 它被切换奇数次 <=> 它的因子个数是奇数 <=> 它是完全平方数。\n- 因此答案 = floor(sqrt(n))。',
    en: 'LeetCode 319 Bulb Switcher:\n\n- Round 1 turns all on, round 2 toggles multiples of 2, ..., round k toggles multiples of k.\n- A bulb ends on iff toggled an odd number of times iff it has an odd number of divisors iff it is a perfect square.\n- So the answer is floor(sqrt(n)).',
  },
  tags: ['misc', 'math', 'brainteaser', 'leetcode'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

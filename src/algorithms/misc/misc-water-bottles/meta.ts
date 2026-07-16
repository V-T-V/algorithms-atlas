// 换水瓶 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-water-bottles',
  categoryId: 'misc',
  title: { zh: '换水瓶', en: 'Water Bottles' },
  summary: {
    zh: 'numBottles 瓶酒，numExchange 空瓶换 1 满瓶，求最多能喝多少瓶（LeetCode 1518）。',
    en: 'Given full bottles and the exchange rate of empty-for-full, find max bottles drinkable (LeetCode 1518).',
  },
  description: {
    zh: 'LeetCode 1518 换水瓶：\n\n- 初始有 numBottles 瓶满水，每 numExchange 个空瓶可换 1 瓶满水。\n- 喝掉满水变成空瓶，循环兑换。\n- 求总共能喝多少瓶。\n\n模拟：每次喝光所有满瓶，用空瓶尽可能兑换新满瓶，直到不足兑换。',
    en: 'LeetCode 1518 Water Bottles:\n\n- Start with numBottles full; every numExchange empties yield one full.\n- Drinking turns full into empty; loop until exchange is impossible.\n- Find total drinkable.\n\nSimulate: drink all full, exchange empties for full greedily, repeat.',
  },
  tags: ['misc', 'simulation', 'greedy', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};

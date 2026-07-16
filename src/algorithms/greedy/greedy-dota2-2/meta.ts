// Dota2 参议院 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-dota2-2',
  categoryId: 'greedy',
  title: { zh: 'Dota2 参议院', en: 'Dota2 Senate' },
  summary: {
    zh: '两阵营轮流投票禁对方；用队列贪心先禁下一个对方。',
    en: 'Two factions vote to ban each other in turn; greedily ban the next opponent using queues.',
  },
  description: {
    zh: 'LeetCode 649 Dota2 参议院：天辉(D)和夜魇(R)按给定顺序轮流，每轮禁掉对方一个还没出手的参议员。用两个队列模拟。',
    en: 'LeetCode 649 Dota2 Senate: Radiant(D) and Dire(R) take turns in given order; each bans an opponent who has not yet acted. Simulated with two queues.',
  },
  tags: ['greedy', 'queue', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

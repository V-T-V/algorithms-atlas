// Dota2 参议院（Dota2 Senate, LeetCode 649）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dota2-senate',
  categoryId: 'greedy',
  title: { zh: 'Dota2 参议院', en: 'Dota2 Senate' },
  summary: {
    zh: 'R 派与 D 派轮流禁止对方投票，求最终胜方（贪心 + 双队列）。',
    en: 'R and D factions alternate banning each other; find the winner (greedy, two queues).',
  },
  description: {
    zh: '参议院由 R（Radiant）和 D（Dire）两派组成，按字符串顺序发言。每位参议员在自己回合可「禁止」一名对方阵营成员在本轮及后续的投票权。被禁者跳过。若有某方所有成员都被禁，则另一方获胜。返回获胜方 "Radiant"/"Dire"。\n\n贪心：每位参议员会优先禁止「下一个」对方成员（最紧邻的威胁），这样最优。用两个队列分别存 R 和 D 的初始下标，每轮比较队首：下标小者先发言，禁止对方队首，并把自身下标 + n 重新入队（进入下一轮）；下标大者被禁出队。直到某队列为空。',
    en: 'The senate consists of R (Radiant) and D (Dire) members, speaking in string order. On a member\'s turn it may "ban" one opposing member\'s voting right for this and future rounds. Banned members are skipped. When one side is fully banned, the other wins. Return "Radiant" or "Dire".\n\nGreedy: each member bans the next opposing member (the closest threat), which is optimal. Use two queues holding R and D initial indices; each step compare the two fronts: the smaller index speaks first, bans the other front, and re-enqueues itself at index + n (next round); the larger is removed. Repeat until one queue is empty.',
  },
  tags: ['greedy', 'queue', 'simulation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  references: [{ label: 'LeetCode 649', url: 'https://leetcode.com/problems/dota2-senate/' }],
  defaultInput: 'RD',
};

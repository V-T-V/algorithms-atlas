// 石子游戏 III（Stone Game III, LeetCode 1406）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stone-game-3',
  categoryId: 'game',
  title: { zh: '石子游戏 III', en: 'Stone Game III' },
  summary: {
    zh: '每次可取 1..3 堆，求先手胜负（DP / 字符串结果）。',
    en: "Take 1..3 piles each turn; determine first player's outcome (DP / string result).",
  },
  description: {
    zh: '石子排成一排，piles[i] 可为负数。Alice 先手，每回合可取接下来的 1、2 或 3 堆。双方都想最大化自己的总分。游戏结束（所有堆被取完）后，分数大者胜。返回 "Alice"/"Bob"/"Tie"。\n\nDP：f(i) 表示从第 i 堆开始，当前玩家能比对手多拿的分数。转移 f(i) = max( sum(i..i+x-1) - f(i+x) )，x=1,2,3。最终比较 f(0) 与 0：>0 Alice 赢，<0 Bob 赢，=0 平局。从右向左迭代即可。',
    en: 'Stones in a row, piles[i] may be negative. Alice first; each turn take the next 1, 2, or 3 piles. Both maximize their own total. After all piles are taken, the larger score wins. Return "Alice"/"Bob"/"Tie".\n\nDP: f(i) = the score advantage the current player can build from pile i. Transition f(i) = max( sum(i..i+x-1) - f(i+x) ) for x=1,2,3. Compare f(0) with 0: >0 Alice wins, <0 Bob wins, =0 tie. Iterate right-to-left.',
  },
  tags: ['game', 'dp', 'minimax'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  references: [{ label: 'LeetCode 1406', url: 'https://leetcode.com/problems/stone-game-iii/' }],
  defaultInput: [1, 2, 3, 7],
};

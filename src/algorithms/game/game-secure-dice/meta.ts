// 安全骰子博弈（Secure Dice Game）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-secure-dice',
  categoryId: 'game',
  title: { zh: '安全骰子博弈', en: 'Secure Dice Game' },
  summary: {
    zh: '安全值 m 下，抛骰子收益为点数，点数>m 则重抛，求最优 m。',
    en: 'Roll a die for its face; reroll if face>m. Find the optimal stopping threshold m.',
  },
  description: {
    zh: '安全骰子：每轮可选择保留当前点数或重抛（但点数超过安全阈值 m 时必须保留）。动态规划求最优期望收益与阈值。',
    en: 'Secure dice: each turn you may keep the face or reroll (but must keep if face exceeds safety threshold m). DP finds optimal expected payoff and threshold.',
  },
  tags: ['game', 'dp', 'stopping-rule'],
  complexity: { time: 'O(f)', space: 'O(f)' },
};

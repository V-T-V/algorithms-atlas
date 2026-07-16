// 公共物品博弈（Public Goods Game）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-public-goods',
  categoryId: 'game',
  title: { zh: '公共物品博弈', en: 'Public Goods Game' },
  summary: {
    zh: '每人投资到公共池，池乘以系数后平分，揭示搭便车问题。',
    en: 'Each invests in a shared pool multiplied then split equally; reveals free-riding.',
  },
  description: {
    zh: '公共物品博弈：n 人各持禀赋 e，投资 g_i，池 G=Σg_i 翻倍 m/n 后平分。收益 e_i-g_i+mG/n。纳什均衡 g_i=0，社会最优 g_i=e。',
    en: 'Public goods game: n players endowment e, invest g_i, pool G multiplied by m/n then split. Payoff e_i-g_i+mG/n. Nash g_i=0, social optimum g_i=e.',
  },
  tags: ['game', 'economics', 'social-dilemma'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

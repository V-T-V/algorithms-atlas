// 硬币议价（Coin Flip Bargaining）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-flip-bargaining',
  categoryId: 'game',
  title: { zh: '硬币议价', en: 'Coin Flip Bargaining' },
  summary: {
    zh: '两人分一美元，谈判失败则按概率随机分配，求子博弈完美。',
    en: 'Two split a dollar; failure triggers probabilistic fallback; find subgame-perfect split.',
  },
  description: {
    zh: '硬币议价：A 提议分给 B 的份额 x，B 接受则成交，拒绝则抛硬币：正面 A 得全部，反面 B 得全部（期望 0.5）。SPNE: A 给 x=0.5。',
    en: 'Coin flip bargaining: A offers B share x; accept -> deal, reject -> coin: heads A gets all, tails B gets all (EV 0.5). SPNE: A offers x=0.5.',
  },
  tags: ['game', 'bargaining', 'subgame-perfect'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

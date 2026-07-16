// 猜硬币 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-matching-pennies-2',
  categoryId: 'game',
  title: { zh: '猜硬币', en: 'Matching Pennies' },
  summary: {
    zh: '行玩家希望匹配、列玩家希望错配；零和、无纯策略纳什。',
    en: 'Row wants to match, column wants to mismatch; zero-sum, no pure Nash.',
  },
  description: {
    zh: '猜硬币（零和博弈）。行/列选 H 或 T。\n      H      T\n  H  1,-1   -1,1\n  T -1,1    1,-1\n无纯策略纳什；唯一混合纳什 (1/2, 1/2)，博弈值 0。',
    en: 'Matching pennies (zero-sum). Actions H or T.\n      H      T\n  H  1,-1   -1,1\n  T -1,1    1,-1\nNo pure Nash; unique mixed Nash (1/2,1/2), value 0.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

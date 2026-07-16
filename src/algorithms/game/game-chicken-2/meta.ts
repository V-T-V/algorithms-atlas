// 胆小鬼博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-chicken-2',
  categoryId: 'game',
  title: { zh: '胆小鬼博弈', en: 'Chicken Game' },
  summary: {
    zh: '两车对冲：直行赢面子、转向保命；双直行同归于尽。',
    en: 'Two cars head-on: swerving loses face, going straight wins; both going straight is disaster.',
  },
  description: {
    zh: '胆小鬼博弈（边缘政策）。行/列选 S(直行) 或 W(转向)。\n      S      W\n  S  0,0    3,1\n  W  1,3    2,2\n两个纯纳什：(S,W) 与 (W,S)；都希望对手先转向。',
    en: 'Chicken game (brinkmanship). Actions S(straight) or W(swerve).\n      S      W\n  S  0,0    3,1\n  W  1,3    2,2\nTwo pure Nash: (S,W) and (W,S); each hopes the other swerves first.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

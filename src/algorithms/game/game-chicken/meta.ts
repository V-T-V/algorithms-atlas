// 胆小鬼博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-chicken',
  categoryId: 'game',
  title: { zh: '胆小鬼博弈', en: 'Game of Chicken' },
  summary: {
    zh: '两人开车对冲，都不让则双输，互让次之，一进一退最优在进者。两个纯纳什（一进一退）。',
    en: 'Two drivers swerve toward each other; both straight = crash, both swerve = ok, one straight one swerve favors the bold. Two pure Nash (asymmetric).',
  },
  description: {
    zh: '进(S)退(W)。双进双输(-6,-6)，双退(0,0)，一进一退时进者+1、退者-1。两个纯纳什：(S,W) 与 (W,S)。',
    en: 'Straight(S)/Swerve(W). Both straight: -6,-6; both swerve: 0,0; one straight one swerve: straight +1, swerve -1. Two asymmetric pure Nash.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

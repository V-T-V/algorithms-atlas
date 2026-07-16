// 性别战博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-battle-of-sexes',
  categoryId: 'game',
  title: { zh: '性别战博弈', en: 'Battle of the Sexes' },
  summary: {
    zh: '两人偏好不同活动但都希望在一起，有两个纯纳什与一个混合纳什。',
    en: 'Two prefer different activities but both want to be together; two pure Nash and one mixed.',
  },
  description: {
    zh: '丈夫偏好歌剧、妻子偏好球赛，但分开都只得 0。两个纯纳什（一起歌剧/一起球赛），加一个混合策略。',
    en: 'Husband prefers opera, wife prefers football, but being apart yields 0. Two pure Nash (both opera / both football) plus one mixed.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

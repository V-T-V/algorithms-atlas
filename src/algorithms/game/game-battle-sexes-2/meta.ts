// 性别战博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-battle-sexes-2',
  categoryId: 'game',
  title: { zh: '性别战博弈', en: 'Battle of the Sexes' },
  summary: {
    zh: '夫妻想在一起但偏好不同活动；两个帕累托有效纯纳什。',
    en: 'Couple wants to be together but prefers different activities; two pareto-efficient pure Nash.',
  },
  description: {
    zh: '性别战（协调博弈）。行/列选 O(歌剧) 或 F(足球)。\n      O      F\n  O  3,2    0,0\n  F  0,0    2,3\n两个纯纳什：(O,O) 与 (F,F)；混合纳什也存在。',
    en: 'Battle of the Sexes (coordination). Actions O(opera) or F(football).\n      O      F\n  O  3,2    0,0\n  F  0,0    2,3\nTwo pure Nash: (O,O) and (F,F); a mixed Nash also exists.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

// Banach-Mazur 博弈（Banach-Mazur Game）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-banach-mazur',
  categoryId: 'game',
  title: { zh: 'Banach-Mazur 博弈', en: 'Banach-Mazur Game' },
  summary: {
    zh: '两玩家交替选区间，决定交点是否落入目标集，刻画 Baire 范畴。',
    en: 'Two players alternately choose nested intervals; whether the limit point lies in the target set characterizes Baire category.',
  },
  description: {
    zh: 'Banach-Mazur：玩家 A/B 交替选取嵌套闭区间，交点唯一。A 想交点在目标集 S，B 想不在。S 为 meager 时 B 必胜。',
    en: 'Banach-Mazur: players A/B alternately pick nested closed intervals; the intersection point is unique. A wants it in S, B wants it out. B wins iff S is meager.',
  },
  tags: ['game', 'topology', 'descriptive-set-theory'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};

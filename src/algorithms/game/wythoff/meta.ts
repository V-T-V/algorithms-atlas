// Wythoff Game · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'wythoff',
  categoryId: 'game',
  title: { zh: '威佐夫博弈', en: 'Wythoff Game' },
  summary: {
    zh: '威佐夫博弈属于game类别。',
    en: 'Wythoff Game is a game algorithm.',
  },
  description: {
    zh: '威佐夫博弈（Wythoff Game）属于game类别的算法。',
    en: 'Wythoff Game is an algorithm in the game category.',
  },
  tags: ["game"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

// Bash Game · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bash-game',
  categoryId: 'game',
  title: { zh: '巴什博弈', en: 'Bash Game' },
  summary: {
    zh: '巴什博弈属于game类别。',
    en: 'Bash Game is a game algorithm.',
  },
  description: {
    zh: '巴什博弈（Bash Game）属于game类别的算法。',
    en: 'Bash Game is an algorithm in the game category.',
  },
  tags: ["game","game-theory"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

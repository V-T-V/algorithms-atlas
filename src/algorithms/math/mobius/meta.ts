// Mobius Function · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mobius',
  categoryId: 'math',
  title: { zh: '莫比乌斯函数', en: 'Mobius Function' },
  summary: {
    zh: '莫比乌斯函数属于math类别。',
    en: 'Mobius Function is a math algorithm.',
  },
  description: {
    zh: '莫比乌斯函数（Mobius Function）属于math类别的算法。',
    en: 'Mobius Function is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(N) sieve / O(√n) single', space: 'O(N)' },
};

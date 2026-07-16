// Modular Inverse · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'inverse-mod',
  categoryId: 'math',
  title: { zh: '模逆元', en: 'Modular Inverse' },
  summary: {
    zh: '模逆元属于math类别。',
    en: 'Modular Inverse is a math algorithm.',
  },
  description: {
    zh: '模逆元（Modular Inverse）属于math类别的算法。',
    en: 'Modular Inverse is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(log m)', space: 'O(1)' },
};

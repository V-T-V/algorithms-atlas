// Miller-Rabin Primality · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'miller-rabin',
  categoryId: 'math',
  title: { zh: 'Miller-Rabin 素性测试', en: 'Miller-Rabin Primality' },
  summary: {
    zh: 'Miller-Rabin 素性测试属于math类别。',
    en: 'Miller-Rabin Primality is a math algorithm.',
  },
  description: {
    zh: 'Miller-Rabin 素性测试（Miller-Rabin Primality）属于math类别的算法。',
    en: 'Miller-Rabin Primality is an algorithm in the math category.',
  },
  tags: ["math","string-matching"],
  complexity: { time: 'O(k · log³ n)', space: 'O(log n)' },
};

// Duval (Lyndon) Factorization · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'duval',
  categoryId: 'string',
  title: { zh: 'Duval 分解', en: 'Duval (Lyndon) Factorization' },
  summary: {
    zh: 'Duval 分解属于string类别。',
    en: 'Duval (Lyndon) Factorization is a string algorithm.',
  },
  description: {
    zh: 'Duval 分解（Duval (Lyndon) Factorization）属于string类别的算法。',
    en: 'Duval (Lyndon) Factorization is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

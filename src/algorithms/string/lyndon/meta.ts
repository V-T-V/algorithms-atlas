// Lyndon Word · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lyndon',
  categoryId: 'string',
  title: { zh: 'Lyndon 词', en: 'Lyndon Word' },
  summary: {
    zh: 'Lyndon 词属于string类别。',
    en: 'Lyndon Word is a string algorithm.',
  },
  description: {
    zh: 'Lyndon 词（Lyndon Word）属于string类别的算法。',
    en: 'Lyndon Word is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

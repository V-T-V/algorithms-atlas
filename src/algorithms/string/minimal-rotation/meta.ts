// Minimal Rotation (Booth) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'minimal-rotation',
  categoryId: 'string',
  title: { zh: '最小循环移位', en: 'Minimal Rotation (Booth)' },
  summary: {
    zh: '最小循环移位属于string类别。',
    en: 'Minimal Rotation (Booth) is a string algorithm.',
  },
  description: {
    zh: '最小循环移位（Minimal Rotation (Booth)）属于string类别的算法。',
    en: 'Minimal Rotation (Booth) is an algorithm in the string category.',
  },
  tags: ["string","game-theory"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// Egg Drop · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'egg-drop',
  categoryId: 'dp',
  title: { zh: '扔鸡蛋', en: 'Egg Drop' },
  summary: {
    zh: '扔鸡蛋属于dp类别。',
    en: 'Egg Drop is a dp algorithm.',
  },
  description: {
    zh: '扔鸡蛋（Egg Drop）属于dp类别的算法。',
    en: 'Egg Drop is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(k log n)', space: 'O(k)' },
};

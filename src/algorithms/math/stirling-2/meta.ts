// Stirling Number S2 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stirling-2',
  categoryId: 'math',
  title: { zh: '第二类 Stirling 数', en: 'Stirling Number S2' },
  summary: {
    zh: '第二类 Stirling 数属于math类别。',
    en: 'Stirling Number S2 is a math algorithm.',
  },
  description: {
    zh: '第二类 Stirling 数（Stirling Number S2）属于math类别的算法。',
    en: 'Stirling Number S2 is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(n·k)', space: 'O(n·k)' },
};

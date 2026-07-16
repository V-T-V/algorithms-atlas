// 首次适应递减（First Fit Decreasing）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-bin-packing-ffd',
  categoryId: 'greedy',
  title: { zh: '首次适应递减', en: 'First Fit Decreasing' },
  summary: {
    zh: '物品降序排列，每个放入第一个能容纳的箱子，近似比 11/9。',
    en: 'Sort items descending, place each in the first bin that fits; ratio 11/9.',
  },
  description: {
    zh: 'FFD 装箱：物品按大小降序，依次放入第一个能装下的箱子。装箱数 ≤ 11/9·OPT+1。',
    en: 'FFD bin packing: items sorted descending, each placed in first fitting bin. Bins <= 11/9·OPT+1.',
  },
  tags: ['greedy', 'bin-packing', 'approximation'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};

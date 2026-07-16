// 优化梳排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comb-sort-optimized',
  categoryId: 'sorting',
  title: { zh: '优化梳排序', en: 'Optimized Comb Sort' },
  summary: {
    zh: '使用最终阶段冒泡短路 + 1.3 收缩因子的梳排序。',
    en: 'Comb sort with a bubble-shortcut final pass and the 1.3 shrink factor.',
  },
  description: {
    zh:
      '优化梳排序（Optimized Comb Sort）在标准梳排序基础上增加两个优化：' +
      '\n- 经验最优收缩因子 1.3（避免退化为 O(n²) 的 9、10 鬼影间隔）。' +
      '\n- gap=1 的最后阶段使用带「无交换即停」短路的冒泡扫描，避免无谓的多趟。',
    en:
      'Optimized Comb Sort augments standard comb sort with two refinements: ' +
      '\n- The empirically best shrink factor 1.3 (avoids the 9/10 gap ghost that causes O(n²) behavior). ' +
      '\n- A short-circuit bubble pass when gap = 1 (stop as soon as a full pass makes no swap).',
  },
  tags: ['sorting', 'exchange', 'in-place', 'unstable', 'optimization'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};

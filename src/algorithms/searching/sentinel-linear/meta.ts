// Sentinel Linear Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sentinel-linear',
  categoryId: 'searching',
  title: { zh: '哨兵线性搜索', en: 'Sentinel Linear Search' },
  summary: {
    zh: '把目标当作哨兵放末尾，循环省去越界判断，加快线性查找。',
    en: 'Places the target as a sentinel at the tail so the scan loop skips the bounds check.',
  },
  description: {
    zh: '哨兵线性搜索（Sentinel Linear Search）是朴素线性搜索的常数优化。把 target 暂存到数组末尾位置作为「哨兵」，扫描时只需比较 a[i] === target 而不必每次检查 i < n——因为哨兵保证循环必然在 i === n-1 处终止。扫完后判断 i 是否等于原长度：若是则说明哨兵命中、原数组中不存在 target。\n\n最坏仍为 O(n)，但每次迭代少一次比较，在大数组上实测提速约 30%。空间 O(1)（需要可写或带副本末尾）。',
    en: 'Sentinel Linear Search is a constant-factor optimisation of naive linear search. Temporarily place target at the tail as a "sentinel": the scan loop then only needs a[i] === target, never an i < n bounds check, since the sentinel guarantees termination at i === n-1. After the loop, if i equals the original length, the sentinel was hit and target was absent.\n\nWorst case stays O(n) but each iteration drops one comparison, giving ~30% speedup on large arrays in practice. Space O(1) (writable tail or an appended copy).',
  },
  tags: ['searching', 'linear', 'sentinel', 'optimization'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

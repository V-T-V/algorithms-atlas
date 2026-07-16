// 线性查找（哨兵） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-linear-sentinel-2',
  categoryId: 'searching',
  title: { zh: '线性查找（哨兵）', en: 'Linear Search (Sentinel)' },
  summary: {
    zh: '把目标值放到数组末尾做哨兵，省去每次循环的越界判断。',
    en: 'Place the target at the array end as a sentinel, removing the bound check inside the loop.',
  },
  description: {
    zh: '哨兵线性查找（Sentinel Linear Search）优化朴素线性查找：把 target 临时放到数组末尾位置作哨兵，于是主循环只需比较 a[i] === target，无需同时检查 i < n（因为哨兵保证必然命中）。命中后再判断 i 是否 < n（真实命中）还是等于哨兵位置（未找到）。比较次数不变 O(n)，但每次循环少一次比较，常数更小。无序数组也可用。',
    en: 'Sentinel linear search optimizes naive linear search: temporarily place target at the array end as a sentinel so the main loop only needs to compare a[i] === target, without also checking i < n (the sentinel guarantees a hit). After the hit, check whether i < n (real hit) or i equals the sentinel position (not found). Comparison count is still O(n) but each loop iteration does one fewer comparison, a smaller constant. Works on unsorted arrays too.',
  },
  tags: ['searching', 'linear', 'sentinel', 'unsorted'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

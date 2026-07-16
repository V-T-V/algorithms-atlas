// 优化煎饼排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pancake-sort-optimized',
  categoryId: 'sorting',
  title: { zh: '优化煎饼排序', en: 'Optimized Pancake Sort' },
  summary: {
    zh: '煎饼排序加「已就位跳过」与「顶部免翻」短路，翻转次数 ≤ 2n−3。',
    en: 'Pancake sort with in-place and at-top short-circuits, ≤ 2n−3 flips.',
  },
  description: {
    zh:
      '优化煎饼排序（Optimized Pancake Sort）在朴素煎饼排序的基础上减少翻转次数：' +
      '\n- 若最大值已在未排序段末尾，跳过本轮两次翻转。' +
      '\n- 若最大值已在顶部，省去第一次「翻到顶」的翻转。' +
      '\n- 维护翻转计数，最坏情况翻转次数 ≤ 2n−3，空数组 / 单元素直接返回。' +
      '\n仍然只用「翻转前缀」一种操作，原地、不稳定。',
    en:
      'Optimized Pancake Sort reduces flips over the naive version: ' +
      '\n- Skip both flips when the max is already at the end of the unsorted segment. ' +
      '\n- Skip the first flip when the max is already on top. ' +
      '\n- Track flip count; worst-case ≤ 2n−3. Empty/single inputs return immediately. ' +
      'Still uses only prefix flips; in-place, unstable.',
  },
  tags: ['sorting', 'pancake', 'flip', 'in-place', 'unstable', 'optimization'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
  attributes: { flips: '≤ 2n−3' },
};

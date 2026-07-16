// 煎饼排序（选极值翻转） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-pancake-min',
  categoryId: 'sorting',
  title: { zh: '煎饼排序（选极值翻转）', en: 'Pancake Sort (Selection-Flip)' },
  summary: {
    zh: '每轮用翻转把当前未排序段的最大值送到段尾，n-1 轮完成排序。',
    en: 'Each round use flips to send the current max of the unsorted segment to its tail; n-1 rounds.',
  },
  description: {
    zh: '煎饼排序（Pancake Sort）只允许用「反转前 k 个」操作（flip(k)）。本实现每轮在未排序段 a[0..size) 中找到最大值的下标 mi：先 flip(mi) 把它翻到数组顶部（下标 0），再 flip(size-1) 把它从顶部翻到当前段尾，固定该位置，size 减一。共 n-1 轮，每轮最多 2 次 flip。比较次数 O(n^2)，翻转次数最多 2(n-1)。不稳定，原地。',
    en: 'Pancake sort only allows reversing the first k elements via flip(k). This implementation finds the index mi of the maximum in the unsorted segment a[0..size): flip(mi) brings it to the top (index 0), then flip(size-1) moves it from the top to the current segment tail, fixing that position; size decreases. n-1 rounds, at most 2 flips each: O(n^2) comparisons, at most 2(n-1) flips. Unstable, in-place.',
  },
  tags: ['sorting', 'comparison', 'in-place', 'flip'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};

// 梳排序（双收缩因子） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-comb-3',
  categoryId: 'sorting',
  title: { zh: '梳排序（双收缩因子）', en: 'Comb Sort (Double-Shrink)' },
  summary: {
    zh: '梳排序用两个交替收缩的间隔因子，加速消除小乌龟值。',
    en: 'Comb sort alternating between two shrinking gaps to kill turtles faster.',
  },
  description: {
    zh: '梳排序（Comb Sort）改进自冒泡排序：用大于 1 的间隔（gap）比较并交换相距 gap 的元素，再逐步缩小 gap。本变体在奇偶趟交替使用收缩因子 1.3 与 1.25，让 gap 序列更密集地覆盖多个尺度，进一步减少尾端的小值（乌龟）气泡。最终 gap=1 时退化为标准冒泡并提前退出。不稳定，原地。',
    en: "Comb sort improves on bubble sort by comparing elements a gap apart, then shrinking the gap. This variant alternates shrink factors 1.3 and 1.25 between passes so the gap sequence covers scales more densely, killing tail-end 'turtles' faster. Falls back to a bubble pass with early exit once gap reaches 1. Unstable, in-place.",
  },
  tags: ['sorting', 'comparison', 'in-place'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};

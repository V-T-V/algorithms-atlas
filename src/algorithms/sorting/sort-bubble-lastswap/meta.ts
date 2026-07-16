// 冒泡排序（末次交换优化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-bubble-lastswap',
  categoryId: 'sorting',
  title: { zh: '冒泡排序（末次交换优化）', en: 'Bubble Sort (Last-Swap Bound)' },
  summary: {
    zh: '记录每趟最后一次交换的位置作为下趟的右边界，跳过已排好尾部。',
    en: "Record the last swap index each pass as the next pass's right bound, skipping the sorted tail.",
  },
  description: {
    zh: '冒泡排序（Bubble Sort）每趟把最大值冒泡到末尾。优化版记录每趟最后一次发生交换的位置 lastSwap，则该位置之后已有序，下趟只需扫描到 lastSwap。对几乎有序的输入可大幅减少比较次数，最优降为 O(n)。本实现即此「末次交换边界」优化。稳定，原地。',
    en: 'Bubble sort bubbles the largest element to the end each pass. The optimized variant records the last swap index; everything after it is already sorted, so the next pass only scans up to that index. This dramatically cuts comparisons on nearly-sorted input, reaching O(n) best case. Stable, in-place.',
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place', 'bubble'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};

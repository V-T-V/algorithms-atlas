// 标准库风格排序（混合排序）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-stdlib-style',
  categoryId: 'sorting',
  title: { zh: '标准库风格排序（混合）', en: 'Standard-library Style Sort (Hybrid)' },
  summary: {
    zh: '模拟 V8/标准库的混合排序：小段用插入排序，大段用快速排序，深度过深时退化为堆排序。',
    en: 'Mimics the V8/standard-library hybrid sort: insertion for small runs, quicksort otherwise, with introsort-style heap fallback.',
  },
  description: {
    zh: '本算法模拟现代标准库（如 V8）的混合排序策略：当待排序段长度小于阈值（如 16）时切换到插入排序（常数因子小、对近乎有序的段极快）；否则用三数取中快速排序；当递归深度超过 2·log₂n 时（接近最坏情况）改用堆排序兜底，从而保证最坏 O(n log n)。这是工业级排序「既快又稳」的典型设计。',
    en: 'This algorithm mimics the hybrid strategy of modern standard libraries (e.g. V8): when the run is shorter than a threshold (say 16), switch to insertion sort (small constant, fast on nearly-sorted data); otherwise use median-of-three quicksort; and when recursion depth exceeds 2·log₂n (approaching worst case), fall back to heapsort to guarantee O(n log n) worst case. This is the canonical "fast and robust" design of production sorts.',
  },
  tags: ['sorting', 'hybrid', 'introsort', 'quicksort', 'heapsort'],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
};

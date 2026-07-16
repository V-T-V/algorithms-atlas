// 先洗牌再排序（防最坏）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-shuffle-then-sort',
  categoryId: 'sorting',
  title: { zh: '洗牌防御排序', en: 'Shuffle-then-Sort (Anti-pessimization)' },
  summary: {
    zh: '排序前先随机打乱数组，避免在已有序/特殊构造的输入上触发最坏情况。',
    en: 'Randomly shuffle the array before sorting to avoid worst-case behavior on sorted or adversarial inputs.',
  },
  description: {
    zh: '本算法在执行快速排序（或其它对输入敏感的排序）之前，先用 Fisher-Yates 算法随机打乱数组。这样可消除「有序输入触发 O(n²) 最坏情况」的问题，使期望复杂度稳定在 O(n log n)。这种「先洗牌再排」的策略被 Java/标准库的快速排序变体广泛采用。',
    en: 'This algorithm randomly shuffles the array with Fisher-Yates before running quicksort (or any input-sensitive sort), eliminating the O(n²) worst case on already-sorted or pathological inputs and stabilizing the expected complexity at O(n log n). The shuffle-then-sort strategy is widely used by standard-library quicksort variants.',
  },
  tags: ['sorting', 'quicksort', 'randomized', 'defensive'],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
};

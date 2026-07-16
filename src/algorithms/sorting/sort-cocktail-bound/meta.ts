// 鸡尾酒排序（边界优化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-cocktail-bound',
  categoryId: 'sorting',
  title: { zh: '鸡尾酒排序（边界优化）', en: 'Cocktail Sort (Bounded)' },
  summary: {
    zh: '双向鸡尾酒排序记录左右最后一次交换位置，跳过已排好区间。',
    en: 'Bidirectional cocktail sort records the last swap on each side to skip sorted ranges.',
  },
  description: {
    zh: '鸡尾酒排序（Cocktail Shaker Sort）是冒泡排序的双向变体：一趟向右把最大冒泡到尾，再一趟向左把最小冒泡到头。本边界优化版分别记录向右、向左两趟各自的最后一次交换下标，作为下趟的上下界，对几乎有序输入收敛更快。最优 O(n)，最坏 O(n^2)。稳定，原地。',
    en: "Cocktail shaker sort is a bidirectional bubble variant: a pass bubbles the max to the right end, then a pass bubbles the min to the left end. This bounded variant records each direction's last swap index as the next pass's bound, converging faster on nearly-sorted input. Best O(n), worst O(n^2). Stable, in-place.",
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place', 'bubble'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};

// 鸡尾酒排序（朴素） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-shaker-naive',
  categoryId: 'sorting',
  title: { zh: '鸡尾酒排序（朴素）', en: 'Cocktail Shaker Sort (Naive)' },
  summary: {
    zh: '朴素双向冒泡：奇数趟向右、偶数趟向左，无边界优化。',
    en: 'Naive bidirectional bubble: odd passes go right, even passes go left, no bound optimization.',
  },
  description: {
    zh: '鸡尾酒排序（双向冒泡）朴素版：奇数趟从左向右把最大冒泡到尾，偶数趟从右向左把最小冒泡到头，交替进行直到无交换。比单向冒泡更适合「两端都有逆序」的输入（如 2,3,4,5,1），但无边界优化时趟数仍可能 O(n)。最坏 O(n^2)，最优 O(n)。稳定，原地。',
    en: 'Naive cocktail shaker (bidirectional bubble): odd passes bubble the max rightward to the tail, even passes bubble the min leftward to the head, alternating until a pass makes no swap. Better than one-way bubble for inputs with inversions at both ends (e.g. 2,3,4,5,1), but without bound optimization the pass count can still be O(n). Worst O(n^2), best O(n). Stable, in-place.',
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place', 'bubble'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};

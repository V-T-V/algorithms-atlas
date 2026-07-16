// 插入排序（链表式） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-insert-linked',
  categoryId: 'sorting',
  title: { zh: '插入排序（链表式）', en: 'Insertion Sort (Linked-List Style)' },
  summary: {
    zh: '用一个「已排序链」+「剩余」两段，逐个把剩余首插入已排序链正确位置。',
    en: 'Maintain a sorted prefix and a remainder; insert each remainder head into its sorted position.',
  },
  description: {
    zh: '插入排序的链表心智模型：把数组视为「已排序前缀」+「未排序后缀」。每次取后缀首元素 v，在已排序前缀中从右向左比较，把大于 v 的元素右移一位，最后把 v 放到空出的位置。这就是标准插入排序，本实现强调「分两段 + 平移」的链表/数组混合视角。O(n^2) 最坏，O(n) 最优，稳定，原地。',
    en: 'Linked-list mental model of insertion sort: view the array as a sorted prefix plus an unsorted suffix. Take the suffix head v, compare right-to-left in the prefix, shifting larger elements right by one, then place v in the freed slot. This is standard insertion sort; this implementation emphasizes the two-segment + shift view. Worst O(n^2), best O(n), stable, in-place.',
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place', 'insertion'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};

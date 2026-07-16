// 快速选择（Hoare 双指针）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quickselect-hoare',
  categoryId: 'selection',
  title: { zh: '快速选择（Hoare）', en: 'Quickselect (Hoare)' },
  summary: {
    zh: '用 Hoare 原始双指针对撞划分在期望 O(n) 内找第 k 小。',
    en: 'Find the k-th smallest in expected O(n) via Hoare two-pointer partitioning.',
  },
  description: {
    zh: 'Hoare 划分是快速选择最早的形态：左右两个指针从两端向中间扫描，遇到逆序对即交换，相遇点即为划分边界。\n\n- 选基准值 pivot（这里取中点元素值）\n- 左指针右移直到 a[i] >= pivot，右指针左移直到 a[j] <= pivot\n- 若 i >= j 则划分完成，返回 j；否则交换 a[i]、a[j] 并继续\n- 根据 k 与划分点的关系只递归一侧\n\n相比 Lomuto，Hoare 划分平均交换次数更少、常数更优，但划分点 p 不一定是基准最终位置。',
    en: 'Hoare partitioning is the original form of quickselect: two pointers scan inward from both ends, swapping out-of-order pairs until they meet.\n\n- Pick pivot value (here the midpoint element)\n- Advance left while a[i] < pivot, retreat right while a[j] > pivot\n- If i >= j partition is done, return j; else swap a[i], a[j] and continue\n- Recurse only into the side containing k\n\nCompared to Lomuto, Hoare does fewer swaps on average with a better constant, but p is not necessarily the pivot final position.',
  },
  tags: ['divide-and-conquer', 'in-place', 'order-statistics'],
  complexity: { time: 'O(n) 期望', space: 'O(log n)' },
};

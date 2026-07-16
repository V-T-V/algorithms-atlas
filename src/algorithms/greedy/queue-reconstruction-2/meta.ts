// 队列重建 II（Queue Reconstruction, 计数法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'queue-reconstruction-2',
  categoryId: 'greedy',
  title: { zh: '队列重建（计数法）', en: 'Queue Reconstruction (Slot Counting)' },
  summary: {
    zh: '按 [h,k] 重建队列，用空位计数法（区别于 splice 插入法）。',
    en: 'Reconstruct queue from [h,k] via empty-slot counting (vs splice insertion).',
  },
  description: {
    zh: 'people[i] = [h_i, k_i] 表示第 i 个人身高 h_i，前面有 k_i 个身高 >= h_i 的人。重建原始队列。\n\n本实现给出另一种贪心写法（与 queue-recon 的 splice 插入法对照）：先按身高升序、k 升序排序，再逐个把每个人放进「空位数组」中第 k 个空位。矮个子先放，高个子后放时直接占据剩余空位的第 k 个——这样高个子插入时矮个子被视为「已占位」，正好对应 k 的语义。整个过程不依赖 splice，用空槽位计数定位，便于展示「占位」过程。',
    en: 'people[i] = [h_i, k_i] where h_i is the height and k_i is the number of people in front with height >= h_i. Reconstruct the queue.\n\nThis is an alternative greedy writeup (contrast with queue-recon\'s splice insertion): sort by height ascending (and k ascending), then place each person into the k-th empty slot of an array of vacancies. Shorter people go in first; when taller ones are placed they simply claim the k-th remaining empty slot — shorter ones already placed count toward k. This avoids splice and uses empty-slot counting to locate positions, making the "occupy" process easy to visualize.',
  },
  tags: ['greedy', 'sorting', 'counting'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
  references: [
    { label: 'LeetCode 406', url: 'https://leetcode.com/problems/queue-reconstruction/' },
  ],
  defaultInput: [
    [7, 0],
    [4, 4],
    [7, 1],
    [5, 0],
    [6, 1],
    [5, 2],
  ],
};

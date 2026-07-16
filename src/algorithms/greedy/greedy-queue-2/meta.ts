// 根据身高重建队列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-queue-2',
  categoryId: 'greedy',
  title: { zh: '根据身高重建队列', en: 'Queue Reconstruction' },
  summary: {
    zh: '每个人 [h,k]：k 是前面 ≥ h 的人数；按 h 降序、k 升序插入。',
    en: 'Each [h,k]: k is the count of people ahead with height ≥ h; insert by h desc, k asc.',
  },
  description: {
    zh: 'LeetCode 406 根据身高重建队列：people[i] = [h_i, k_i]，k_i 是排在前面的身高 ≥ h_i 的人数。先按 h 降序、同 h 按 k 升序，再按 k 插入结果。',
    en: 'LeetCode 406 Queue Reconstruction: people[i] = [h_i, k_i], k_i = count of taller-or-equal people ahead. Sort by h desc (k asc), then insert at index k.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};

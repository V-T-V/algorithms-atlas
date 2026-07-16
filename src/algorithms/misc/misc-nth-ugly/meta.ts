// 第 N 个丑数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-nth-ugly',
  categoryId: 'misc',
  title: { zh: '第 N 个丑数', en: 'Nth Ugly Number' },
  summary: {
    zh: '只含因子 2/3/5 的数为丑数，三指针合并求第 n 个（LeetCode 264）。',
    en: 'Numbers whose only prime factors are 2, 3, or 5; use three pointers to merge (LeetCode 264).',
  },
  description: {
    zh: 'LeetCode 264 第 N 个丑数：\n\n- 丑数 = 只含因子 2、3、5 的正整数（1 视为丑数）。\n- 三指针法：维护 p2/p3/p5，每次取 min(ugly[p2]*2, ugly[p3]*3, ugly[p5]*5)，并推进对应指针。\n- 去重：若多个指针产生相同值，都推进。\n- O(n) 时间、O(n) 空间。',
    en: 'LeetCode 264 Nth Ugly Number:\n\n- Ugly numbers have only prime factors 2, 3, or 5 (1 is ugly).\n- Three-pointer method: keep p2/p3/p5, take min(ugly[p2]*2, ugly[p3]*3, ugly[p5]*5), advance matching pointers.\n- Deduplicate by advancing all pointers that produce the same value.\n- O(n) time, O(n) space.',
  },
  tags: ['misc', 'dp', 'three-pointer', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

// 数组嵌套 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-array-nesting',
  categoryId: 'recursion',
  title: { zh: '数组嵌套（递归找环）', en: 'Array Nesting (Recursive Cycle)' },
  summary: {
    zh: '递归沿 nums[i] 指针跳转直到回到起点，找最长环，O(n) 时间。',
    en: 'Recursively hop along nums[i] pointers until returning to the start to find the longest cycle in O(n).',
  },
  description: {
    zh: '给定长度 n 的数组 nums，元素是 [0,n) 互不相同的整数。从下标 i 出发，不断跳到 nums[i]，会形成一个环。求所有起点中最长环的长度。递归解法：从每个未访问下标出发，递归跳转并标记访问，回到起点时返回环长。由于每个元素只访问一次，总时间 O(n)。',
    en: 'Given an array nums of length n with distinct integers in [0,n), starting at index i and repeatedly jumping to nums[i] forms a cycle. Find the longest cycle over all starting points. Recursive solution: from each unvisited index, recurse by hopping and mark visited; return the cycle length when back at the start. Each element is visited once, so total time is O(n).',
  },
  tags: ['recursion', 'array', 'cycle-detection', 'in-place'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

// 两数之和（双指针·有序）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'two-pointer-sum',
  categoryId: 'design',
  title: { zh: '两数之和（双指针·有序）', en: 'Two Sum (Two Pointers, Sorted)' },
  summary: {
    zh: '有序数组两端对撞指针 O(n) 找和为 target 的一对下标。',
    en: 'Colliding two pointers on a sorted array find a target-sum pair in O(n).',
  },
  description: {
    zh: '两数之和的经典设计范式应用：当数组**已升序**，用左右两端对撞的双指针，依据当前和与 target 的关系单向移动一个指针，O(n) 内定位一对解。\n\n- sum = a[L]+a[R]\n- sum == target → 命中\n- sum < target → L++（需要更大）\n- sum > target → R--（需要更小）\n\n与哈希表法（无序、O(n) 时间 O(n) 空间）相比，双指针法只用 O(1) 额外空间，但要求输入有序。',
    en: 'A canonical design-paradigm application of two sum: when the array is **already sorted**, use colliding left/right pointers and move only one pointer based on current sum vs target, locating a pair in O(n).\n\n- sum = a[L]+a[R]\n- sum == target → hit\n- sum < target → L++ (need larger)\n- sum > target → R-- (need smaller)\n\nUnlike the hash-table method (unordered, O(n) time and space), the two-pointer method uses O(1) extra space but requires sorted input.',
  },
  tags: ['two-pointer', 'design-paradigm'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

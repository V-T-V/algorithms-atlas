// 查找重复数（链环） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-duplicate-2',
  categoryId: 'searching',
  title: { zh: '查找重复数（链环）', en: 'Find Duplicate (Cycle)' },
  summary: {
    zh: '把值当下标成链，用快慢指针找环入口即重复数。',
    en: 'Treat values as next-index to form a linked cycle; slow/fast pointers find the entry = duplicate.',
  },
  description: {
    zh: '查找重复数：n+1 个数，值域 [1,n]，恰有一个重复（可能多次）。把数组视为隐式链表 i -> arr[i]，因值域有限必有环，环入口即重复数。用 Floyd 龟兔赛跑：慢指针一步、快指针两步相遇后，重置慢指针到 0 同速前进再次相遇即入口。时间 O(n)，空间 O(1)，不修改数组。LeetCode 287。',
    en: 'Find the duplicate: n+1 numbers in range [1,n] with exactly one duplicate (possibly multiple times). View the array as an implicit linked list i -> arr[i]; the bounded range guarantees a cycle whose entry is the duplicate. Use Floyd tortoise and hare: slow moves one step, fast two; after they meet, reset slow to 0 and advance both one step until they meet again at the entry. Time O(n), space O(1), no array modification. LeetCode 287.',
  },
  tags: ['searching', 'floyd', 'cycle', 'duplicate'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

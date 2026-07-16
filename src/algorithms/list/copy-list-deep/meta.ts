// Deep Copy Linked List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'copy-list-deep',
  categoryId: 'list',
  title: { zh: '深拷贝链表', en: 'Deep Copy Linked List' },
  summary: {
    zh: '递归 + 哈希记忆化深拷贝带任意 next 结构的链表，处理环与重入。',
    en: 'Recursively deep-copies a list with arbitrary linkage via a memoized hash map, handling cycles.',
  },
  description: {
    zh: '深拷贝链表（Deep Copy Linked List）逐节点复制整条链表，保证新链表与原链表结构独立。本实现支持节点不仅带 next，还可能带 random/arbitrary 指针（指向链表内任意节点或 null）的通用情形，用「访问哈希表」做记忆化：每当访问到一个原节点就立刻创建其副本并登记，遇到已登记节点直接复用，从而正确处理环、菱形共享等结构。\n\n时间 O(n)，空间 O(n)（哈希表）。相比「原地交织法」，递归 + 记忆化更直观，且天然支持任意指针拓扑。',
    en: 'Deep Copy Linked List clones a list node by node so the new list is structurally independent of the original. This implementation supports the general case where nodes carry not only next but also a random/arbitrary pointer (to any node or null), using a visited hash map for memoisation: each original node visited gets an immediate copy registered, and revisits return the existing copy, correctly handling cycles and diamond sharing.\n\nTime O(n), space O(n) (hash map). Compared with the "in-place interleaving" trick, recursion + memoisation is more intuitive and naturally supports arbitrary pointer topologies.',
  },
  tags: ['list', 'linked-list', 'deep-copy', 'recursive', 'hash-map'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

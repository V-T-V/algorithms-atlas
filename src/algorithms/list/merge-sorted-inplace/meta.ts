// Merge Sorted Lists In-Place · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'merge-sorted-inplace',
  categoryId: 'list',
  title: { zh: '原地合并有序链表', en: 'Merge Sorted Lists In-Place' },
  summary: {
    zh: '用哑节点 + 双指针逐节点比较，原地重连 next，不新建节点。',
    en: 'A dummy node plus two pointers relinks next in place, creating no new nodes.',
  },
  description: {
    zh: '原地合并两条已排序链表（Merge Two Sorted Lists In-Place）：给定两条非降序单链表，合并为一条仍非降序的链表，要求复用原节点、不开新节点。\n\n做法：用哑节点作新链头，维护尾指针 tail；每次比较 l1、l2 当前节点的值，较小者接到 tail 后并前移；任一链耗尽则把另一链整体接到尾部。时间 O(n+m)，空间 O(1)（不含哑节点）。与「新建节点版」相比省去分配，适合嵌入式 / 性能敏感场景。',
    en: 'Merge Two Sorted Lists In-Place: given two non-decreasing singly-linked lists, merge them into one non-decreasing list, reusing existing nodes and allocating none.\n\nApproach: a dummy node heads the new list; a tail pointer is maintained. At each step compare the current nodes of l1 and l2, append the smaller to tail and advance it; when one list is exhausted, splice the other onto the tail. Time O(n+m), space O(1) (excluding the dummy). Compared with a node-allocating version it avoids allocation, suited to embedded / performance-sensitive code.',
  },
  tags: ['list', 'linked-list', 'merge', 'two-pointer', 'in-place', 'sorted'],
  complexity: { time: 'O(n+m)', space: 'O(1)' },
};

// Reverse Nodes in k-Group · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'reverse-nodes-kgroup',
  categoryId: 'list',
  title: { zh: 'K 个一组反转链表', en: 'Reverse Nodes in k-Group' },
  summary: {
    zh: '每 k 个节点一组就地反转，不足 k 个的末尾保持原序。',
    en: 'Reverses the list in groups of k in place; any trailing group shorter than k is left as-is.',
  },
  description: {
    zh: 'K 个一组反转链表（Reverse Nodes in k-Group）：把链表分成若干长度为 k 的连续段，每段就地反转；若剩余节点不足 k 个则保持原顺序不反转。例如 1→2→3→4→5 在 k=2 下得到 2→1→4→3→5。\n\n实现用「哑节点 + 段尾衔接」：每轮先探测剩余是否够 k 个，够则反转该 k 段并把段头段尾接到前驱。时间 O(n)（每节点常数次操作），空间 O(1)。是反转链表与区间操作的典型综合题。',
    en: 'Reverse Nodes in k-Group splits the list into consecutive segments of length k, reversing each segment in place; any leftover group with fewer than k nodes is left in its original order. E.g. 1→2→3→4→5 with k=2 yields 2→1→4→3→5.\n\nImplementation uses a dummy node plus segment-tail stitching: each round first checks whether at least k nodes remain, reverses that k-block, then re-links head and tail to the predecessor. Time O(n) (constant work per node), space O(1). A classic exercise combining reversal with interval operations.',
  },
  tags: ['list', 'linked-list', 'reverse', 'two-pointer', 'in-place'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

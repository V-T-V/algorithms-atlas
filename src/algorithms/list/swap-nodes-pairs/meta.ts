// Swap Nodes in Pairs · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'swap-nodes-pairs',
  categoryId: 'list',
  title: { zh: '两两交换链表节点', en: 'Swap Nodes in Pairs' },
  summary: {
    zh: '把相邻两个节点交换并接回前驱，奇数个末尾节点保持不动。',
    en: 'Swaps each adjacent pair and re-links to the predecessor; a trailing odd node stays put.',
  },
  description: {
    zh: '两两交换链表节点（Swap Nodes in Pairs）：给定链表，每两个相邻节点交换位置。例如 1→2→3→4 得到 2→1→4→3，1→2→3 得到 2→1→3。\n\n关键在于「交换节点本身」（修改 next 指针）而非「只交换值」。用哑节点简化头部的处理：每次取相邻的 a、b 两个节点，让 prev→b、b→a、a→b.next，然后 prev = a 推进。时间 O(n)，空间 O(1)。是 reverseKGroup 的 k=2 特例，但因为不需要探测长度而更简单。',
    en: 'Swap Nodes in Pairs: given a list, swap every two adjacent nodes. E.g. 1→2→3→4 becomes 2→1→4→3, and 1→2→3 becomes 2→1→3.\n\nThe key is to swap the nodes themselves (rewire next pointers), not merely their values. A dummy node simplifies head handling: each step takes the adjacent pair a, b and sets prev→b, b→a, a→b.next, then advances prev = a. Time O(n), space O(1). This is the k=2 special case of reverseKGroup but simpler since no length probing is needed.',
  },
  tags: ['list', 'linked-list', 'swap', 'two-pointer', 'in-place'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

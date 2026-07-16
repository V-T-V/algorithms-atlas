// Add Two Numbers II · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'add-two-numbers-2',
  categoryId: 'list',
  title: { zh: '两数相加 II（正向存储）', en: 'Add Two Numbers II' },
  summary: {
    zh: '两条链表正向存储整数，相加返回正向存储的和链表。',
    en: 'Two lists store integers most-significant-first; add them and return the sum in the same order.',
  },
  description: {
    zh: '两数相加 II（Add Two Numbers II）：两条非空链表分别正向（高位在前）存储两个非负整数，例如 7→2→4→3 表示 7243。要求相加并返回同样正向存储的和链表，且不得反转输入链表的指针。\n\n难点在于进位发生在低位、而低位在链表尾部，需从尾向头相加。解法：用两个栈把两条链表依次压栈，再逐位弹出相加（带进位），把新位用「头插法」插到结果链头。时间 O(max(m,n))，空间 O(m+n)（两个栈）。相比 Add Two Numbers I（逆序存储、从头加），这里因正向存储需要先「对齐到尾」。',
    en: 'Add Two Numbers II: two non-empty lists store non-negative integers most-significant-digit first (e.g. 7→2→4→3 = 7243). Add them and return the sum in the same most-significant-first order, without reversing the input lists.\n\nThe challenge is that the carry originates at the low end (the tail), so addition must proceed tail-to-head. Solution: push both lists onto two stacks, then pop and add digit by digit with a carry, prepending each new digit to the head of the result. Time O(max(m,n)), space O(m+n) (two stacks). Compared with Add Two Numbers I (stored reversed, added head-first), the most-significant-first storage requires first "aligning to the tail".',
  },
  tags: ['list', 'linked-list', 'addition', 'stack', 'carry'],
  complexity: { time: 'O(max(m,n))', space: 'O(m+n)' },
};

// Monotonic Stack · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'monotonic-stack-lr',
  categoryId: 'design',
  title: { zh: '单调栈', en: 'Monotonic Stack' },
  summary: {
    zh: '单调栈 O(n) 找每个元素左/右第一个更小（或更大）的元素。',
    en: 'A monotonic stack finds the next/previous smaller (or greater) element for every item in O(n).',
  },
  description: {
    zh: '单调栈（Monotonic Stack）利用栈内元素保持单调性，在一次扫描中高效解决「找每个元素左/右第一个更小（或更大）元素」类问题：\n\n- 求「右侧第一个更小」：从左到右扫描，维护一个**单调递增**栈（存下标）。对当前元素 a[i]，不断弹出栈顶直到栈顶对应的值 <= a[i]；每次弹出的元素的「右侧第一个更小」就是 i。然后把 i 压栈。\n- 「左侧第一个更小」可在压栈前从栈顶直接读取（栈顶即左侧最近的更小元素）。\n- 反转扫描方向或改单调性可解决「更大」变体。\n\n每个元素至多入栈、出栈各一次，故总时间 O(n)。本实现一次扫描同时求出 left[i]（左侧第一个更小的下标，无则 -1）与 right[i]（右侧第一个更小的下标，无则 n）。',
    en: 'A monotonic stack keeps its contents in sorted order to efficiently solve "find the previous/next smaller (or greater) element" problems in one pass:\n\n- For "next smaller to the right": scan left-to-right maintaining a **monotonically increasing** stack (of indices). For the current element a[i], pop the stack while the top\'s value > a[i]; each popped element\'s "next smaller to the right" is i. Then push i.\n- "Previous smaller to the left" is read directly from the stack top before pushing (the top is the nearest smaller element on the left).\n- Reverse the scan or flip the ordering for "greater" variants.\n\nEach element is pushed and popped at most once, so total time is O(n). This implementation computes both left[i] (index of previous smaller, or -1) and right[i] (index of next smaller, or n) in one pass.',
  },
  tags: ['design', 'monotonic-stack', 'stack'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

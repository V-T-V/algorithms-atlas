import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-mono-queue-2',
  categoryId: 'ds',
  title: { zh: '单调队列（滑动窗口）', en: 'Monotone Queue (Sliding Window)' },
  summary: {
    zh: '维护单调性的双端队列，O(n) 求所有定长滑动窗口的最值。',
    en: 'Deque preserving monotonicity; O(n) min/max over all fixed-length sliding windows.',
  },
  description: {
    zh: '窗口右端入队时弹出破坏单调性的尾部，左端按窗口边界出队。',
    en: 'On enqueue, pop the tail that breaks monotonicity; dequeue the head when it leaves the window.',
  },
  tags: ['ds', 'queue', 'monotone', 'sliding-window'],
  complexity: { time: 'O(n)', space: 'O(k)' },
};

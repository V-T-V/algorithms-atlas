// 滑动窗口最大值（单调队列）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sliding-window-max',
  categoryId: 'design',
  title: { zh: '滑动窗口最大值', en: 'Sliding Window Maximum' },
  summary: {
    zh: '单调递减队列维护窗口候选最大，每个位置均摊 O(1)。',
    en: 'A monotone-decreasing deque maintains window maxima at amortized O(1) per position.',
  },
  description: {
    zh: '大小为 k 的窗口从左滑到右，求每个窗口的最大值。朴素法 O(n·k)。单调队列法：维护一个下标的双端队列，对应值**单调递减**：\n\n- 入队前从队尾弹出所有 <= 新元素的（它们永远不可能再当最大值）\n- 把当前下标入队\n- 队头若已超出窗口范围则弹出\n- 队头下标对应的值即当前窗口最大值\n\n时间 O(n)，空间 O(k)。',
    en: 'Slide a window of size k across the array, report each window max. Naive is O(n·k). Monotone-deque method keeps a deque of indices whose values are **monotonically decreasing**:\n\n- Before pushing, pop from the back all elements <= the new one (they can never be max again)\n- Push the current index\n- Pop the front if it has left the window\n- The front index corresponds to the current window max\n\nTime O(n), space O(k).',
  },
  tags: ['sliding-window', 'monotonic-queue', 'deque'],
  complexity: { time: 'O(n)', space: 'O(k)' },
};

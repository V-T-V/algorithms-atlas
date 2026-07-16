// 单调双端队列（滑动窗口最值）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-monotonic-deque',
  categoryId: 'ds',
  title: { zh: '单调双端队列（滑动窗口最值）', en: 'Monotonic Deque (Sliding Window Extremum)' },
  summary: {
    zh: '基于双端队列维护单调性，O(n) 求每个定长滑动窗口的最小/最大值。',
    en: 'Maintain monotonicity with a deque; O(n) compute min/max of each fixed-length sliding window.',
  },
  description: {
    zh: '用双端队列存放元素下标，保持队列内对应的值单调（求最大值时单调递减，求最小值时单调递增）。新元素入队时从队尾弹出所有不如它优的元素，并从队首弹出超出窗口的下标。每个下标至多入队出队一次，故 O(n)。本实现返回每个窗口的最值数组及其下标，区别于已有的 monotonic-queue（侧重接口而非滑动窗口演示）。零 DOM 依赖。',
    en: 'A deque stores indices with values kept monotonic (decreasing for max, increasing for min). On enqueue, pop from the back all worse elements; pop from the front those outside the window. Each index enters/leaves once, so O(n). Returns the per-window extremum array with indices; distinct from the existing monotonic-queue. Zero DOM dependency.',
  },
  tags: ['ds', 'deque', 'sliding-window', 'monotonic'],
  complexity: { time: 'O(n)', space: 'O(k)' },
};

// 飞奔查找（变体 / 指数跳跃二分混合）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-gallop-2',
  categoryId: 'searching',
  title: { zh: '飞奔查找（变体）', en: 'Gallop Search (Variant)' },
  summary: {
    zh: '指数倍增跳跃至越过目标，再二分精确定位，适合大数组前段定位。',
    en: 'Exponentially gallop past the target then binary-search the bracket; great for large arrays when the target is near the front.',
  },
  description: {
    zh: '飞奔查找（galloping search）与 exponential search 同源，但语义偏「在线流式」：当不确定数组（或数据流）长度时，倍增步长 1, 2, 4, 8, ... 直到 arr[i] >= target 或越界；再在 [i/2, i] 区间二分查找。\n\n本变体在已知数组上提供等价行为，并加一个「停步检测」钩子。复杂度 O(log n)。',
    en: 'Gallop search shares its roots with exponential search but has an online/streaming flavor: when the array length is unknown, double the index 1,2,4,8,... until arr[i] >= target or OOB; then binary-search [i/2, i]. This variant provides the same behavior on a known array with a stop-detection hook. Complexity O(log n).',
  },
  tags: ['searching', 'gallop-search', 'exponential', 'binary-search'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};

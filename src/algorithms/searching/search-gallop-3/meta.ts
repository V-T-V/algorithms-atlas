// 飞奔查找 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-gallop-3',
  categoryId: 'searching',
  title: { zh: '飞奔查找', en: 'Galloping Search' },
  summary: {
    zh: '指数扩大下标定位块，块内线性回扫；适合目标靠前的有序数据。',
    en: 'Exponentially grow the index to bound a block, then linear-scan back; good when the target is near the front.',
  },
  description: {
    zh: '飞奔查找（Galloping Search）与指数查找类似：以 1,2,4,8... 指数扩大下标 i 直到 arr[i] >= target 或越界，得到候选块 [i/2, i]；然后在块内从右向左线性扫描找 target。对目标靠前的有序数据非常高效（O(log k)），目标靠后则退化。本实现块内线性扫描。空间 O(1)。',
    en: 'Galloping search resembles exponential search: grow the index i by 1,2,4,8... until arr[i] >= target or out of bounds, giving candidate block [i/2, i]; then linear-scan the block (right to left) for the target. Very efficient (O(log k)) when the target is near the front of sorted data; degenerates when the target is near the back. This implementation linear-scans the block. Space O(1).',
  },
  tags: ['searching', 'gallop', 'exponential', 'sorted', 'unbounded'],
  complexity: { time: 'O(log k)', space: 'O(1)' },
};

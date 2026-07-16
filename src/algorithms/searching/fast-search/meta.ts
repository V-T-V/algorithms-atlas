// Fast Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fast-search',
  categoryId: 'searching',
  title: { zh: '快速搜索', en: 'Fast Search' },
  summary: {
    zh: '分块二分：先在块摘要上二分定位块，再在块内二分。',
    en: 'Block binary search: binary search block summaries, then binary search within the block.',
  },
  description: {
    zh:
      'Fast Search（快速搜索，又称 sqrt-decomposition binary search）：' +
      '\n- 把长度 n 的升序数组按 `b = ⌊√n⌋` 切成约 √n 个块，每块保留首元素（块摘要）。' +
      '\n- 第一步：在「块首元素数组」上二分，定位目标可能所在的块（O(log √n)）。' +
      '\n- 第二步：在该块的至多 b 个元素上二分（O(log √n)）。' +
      '\n- 总复杂度 `O(log n)`，但对缓存友好（块摘要小常驻），且便于并行。' +
      '\n本质是两段式二分，常用于数据库索引的叶子定位。',
    en:
      'Fast Search (sqrt-decomposition binary search): ' +
      "\n- Split the ascending array of length n into ~√n blocks of size b = ⌊√n⌋, keeping each block's " +
      'first element as a summary. ' +
      '\n- Step 1: binary search the summary array to locate the candidate block (O(log √n)). ' +
      '\n- Step 2: binary search within that block of at most b elements (O(log √n)). ' +
      '\n- Total O(log n), but cache-friendly (summary fits in cache) and parallelizable. ' +
      'A two-phase binary search, common for leaf localization in database indexes.',
  },
  tags: ['searching', 'sorted', 'block', 'two-phase', 'cache-friendly'],
  complexity: { time: 'O(log n)', space: 'O(√n)' },
};

// Write-Behind（Write-Behind）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-write-behind',
  categoryId: 'design',
  title: { zh: 'Write-Behind', en: 'Write-Behind' },
  summary: {
    zh: 'Write-Behind：先写缓存后异步刷 DB。',
    en: 'Write-behind: write cache first, flush to DB asynchronously.',
  },
  description: {
    zh: 'Write-Behind（Write-Back）：写时只更新缓存并标记 dirty，后台批量异步刷入 DB。写延迟低但有短暂不一致风险。',
    en: 'Write-Behind (Write-Back) updates only the cache and marks dirty on write; a background task flushes to DB in batches. Low write latency but short-term inconsistency risk.',
  },
  tags: ['design', 'cache', 'write-behind', 'async'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};

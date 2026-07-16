// Write-Through（Write-Through）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-write-through',
  categoryId: 'design',
  title: { zh: 'Write-Through', en: 'Write-Through' },
  summary: {
    zh: 'Write-Through：写时同步更新缓存与 DB。',
    en: 'Write-through: synchronously update both cache and DB on write.',
  },
  description: {
    zh: 'Write-Through：写入时同步更新缓存和 DB（强一致），读永远命中缓存。延迟高但数据一致性好。',
    en: 'Write-Through synchronously updates cache and DB on write (strong consistency); reads always hit the cache. Higher write latency but better consistency.',
  },
  tags: ['design', 'cache', 'write-through', 'consistency'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};

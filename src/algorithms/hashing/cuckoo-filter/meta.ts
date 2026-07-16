// Cuckoo Filter · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cuckoo-filter',
  categoryId: 'hashing',
  title: { zh: '布谷鸟过滤器', en: 'Cuckoo Filter' },
  summary: {
    zh: '支持删除的近似集合查询：每桶 4 槽指纹 + 双哈希踢出。',
    en: 'A deletion-capable approximate set membership test: 4-slot fingerprint buckets with two-hash cuckoo eviction.',
  },
  description: {
    zh: '布谷鸟过滤器（Fan et al. 2014）用「指纹 + 双桶踢出」支持集合的近似成员查询（含删除），常用于替代布隆过滤器。每个元素 x 经两个哈希得到候选桶 i1=hash(x) 与 i2=i1⊕hash(fingerprint(x))（部分键布谷鸟哈希，partial-key cuckoo hashing）。每个桶存放最多 b=4 个定长指纹。插入时把指纹放入两桶之一；若满则随机踢出一个已有指纹，挪到它的另一候选桶，循环直至成功或达踢出上限。查询时检查两桶是否含该指纹。删除只需从桶中移除指纹（无假阴性，但可能有假阳性）。',
    en: 'The Cuckoo Filter (Fan et al. 2014) uses "fingerprint + two-bucket eviction" to support approximate membership queries with deletion, often replacing Bloom filters. Each element x maps to two candidate buckets i1=hash(x) and i2=i1⊕hash(fingerprint(x)) (partial-key cuckoo hashing). Each bucket holds up to b=4 fixed-length fingerprints. Insert places the fingerprint in either bucket; if both are full it randomly evicts a resident fingerprint, relocating it to its alternate bucket, looping until success or the kick limit is hit. Lookup checks both buckets for the fingerprint. Deletion simply removes the fingerprint (no false negatives, though false positives can occur).',
  },
  tags: ['hashing', 'probabilistic', 'bloom-filter', 'membership'],
  complexity: { time: 'O(1) expected', space: 'O(n)' },
};

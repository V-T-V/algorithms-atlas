// 计数布隆过滤器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'counting-bloom-impl',
  categoryId: 'hashing',
  title: { zh: '计数布隆过滤器', en: 'Counting Bloom Filter' },
  summary: {
    zh: '位数组升级为计数数组，支持删除；查询仍无假阴性、可能有假阳性。',
    en: 'Replace bits with counters to support deletion; queries still have no false negatives, possible false positives.',
  },
  description: {
    zh: '计数布隆过滤器（Counting Bloom Filter）由 Fan 等人（1998）提出，是经典布隆过滤器的可删除变体。原版布隆过滤器用位数组（0/1）表示元素存在，但「置 1」不可逆，无法删除元素。计数布隆过滤器把每个槽从 1 位扩展为一个小整数计数器（通常 3~4 位，即 0~7 或 0~15）。插入元素时，对 k 个哈希位置各 +1；删除元素时各 -1；查询时若所有 k 个位置 > 0 则「可能存在」，若任一为 0 则「一定不存在」。计数器的代价是空间增大 3~4 倍，但换来删除能力。需注意计数器上溢风险（4 位计数器在 16 次重复插入后饱和），以及删除操作要求元素确实曾插入（否则可能误删他人共享的计数器）。广泛用于缓存、去重、网络路由表等需要动态增删的场景。',
    en: 'The Counting Bloom Filter, proposed by Fan et al. (1998), is the deletable variant of the classic Bloom filter. The original uses a bit array (0/1) to record membership, but setting a bit is irreversible, so elements cannot be removed. The counting variant expands each slot from one bit to a small integer counter (typically 3~4 bits, i.e. 0~7 or 0~15). On insert, each of the k hashed positions is incremented by 1; on delete, decremented by 1; a query returns "possibly present" if all k counters are > 0, and "definitely absent" if any is 0. The cost is 3~4× the space, but deletion becomes possible. One must guard against counter overflow (a 4-bit counter saturates after 16 repeated inserts) and ensure elements are only deleted if they were actually inserted (deleting a never-inserted element could corrupt a counter shared with others). It is widely used in caches, deduplication, and routing tables that need dynamic add/remove.',
  },
  tags: ['hashing', 'bloom-filter', 'probabilistic', 'membership'],
  complexity: { time: 'O(k)', space: 'O(m·counterBits)' },
};

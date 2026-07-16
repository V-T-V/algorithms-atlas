// hash-jenkins · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-jenkins',
  categoryId: 'hashing',
  title: { zh: 'Jenkins 一次一击', en: 'Jenkins One-at-a-Time' },
  summary: {
    zh: 'Bob Jenkins 一次一击哈希：hash+=c; hash+=(hash<<10); hash^=(hash>>6)。',
    en: 'Bob Jenkins one-at-a-time hash: hash+=c; hash+=(hash<<10); hash^=(hash>>6).',
  },
  description: {
    zh: 'Jenkins 一次一击（Bob Jenkins）：\n\n- 每字节：hash += c; hash += (hash << 10); hash ^= (hash >> 6)。\n- 终态：hash += (hash << 3); hash ^= (hash >> 11); hash += (hash << 15)。\n- 雪崩性质好，适合哈希表。',
    en: 'Jenkins one-at-a-time (Bob Jenkins):\n\n- Per byte: hash += c; hash += (hash << 10); hash ^= (hash >> 6).\n- Finalize: hash += (hash << 3); hash ^= (hash >> 11); hash += (hash << 15).\n- Good avalanche; suitable for hash tables.',
  },
  tags: ['hashing', 'non-cryptographic', 'avalanche'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

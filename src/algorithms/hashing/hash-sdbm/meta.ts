// hash-sdbm · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-sdbm',
  categoryId: 'hashing',
  title: { zh: 'SDBM 哈希', en: 'SDBM Hash' },
  summary: {
    zh: 'SDBM 数据库使用的字符串哈希：hash = c + hash*65599。',
    en: 'String hash used by the SDBM database: hash = c + hash*65599.',
  },
  description: {
    zh: 'SDBM 哈希（来自 SDBM 数据库库）：\n\n- 对每个字节 c：hash = c + (hash << 6) + (hash << 16) - hash。\n- 等价于 hash = hash * 65599 + c。\n- 分布良好，常用于字符串哈希表。',
    en: 'SDBM hash (from the SDBM database library):\n\n- For each byte c: hash = c + (hash << 6) + (hash << 16) - hash.\n- Equivalent to hash = hash * 65599 + c.\n- Good distribution; common in string hash tables.',
  },
  tags: ['hashing', 'non-cryptographic', 'string'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// DJB2 哈希 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-djb2',
  categoryId: 'hashing',
  title: { zh: 'DJB2 哈希', en: 'DJB2 Hash' },
  summary: {
    zh: '经典字符串哈希：hash = hash*33 + c，初值 5381，简单高效。',
    en: 'Classic string hash: hash = hash*33 + c, starting at 5381, simple and efficient.',
  },
  description: {
    zh: 'DJB2（Daniel J. Bernstein）字符串哈希：\n\n- 初始 hash = 5381。\n- 对每个字节 c：hash = hash * 33 + c。\n- 等价优化：hash = ((hash << 5) + hash) + c。\n- 简单、快速、分布良好，广泛用于哈希表教学。',
    en: 'DJB2 (Daniel J. Bernstein) string hash:\n\n- Start hash = 5381.\n- For each byte c: hash = hash * 33 + c.\n- Optimized equivalent: hash = ((hash << 5) + hash) + c.\n- Simple, fast, well-distributed; widely used in teaching hash tables.',
  },
  tags: ['hashing', 'non-cryptographic', 'string'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// ICE 哈希（ICE Hash）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-ice',
  categoryId: 'hashing',
  title: { zh: 'ICE 哈希', en: 'ICE Hash' },
  summary: {
    zh: '整数组合哈希：移位+加法+异或混合，适合小整数键快速散列。',
    en: 'Integer-combine hash via shift+add+xor mixing; fast for small integer keys.',
  },
  description: {
    zh: 'ICE：h=key；h^=h>>>16；h*=0x85ebca6b；h^=h>>>13；h*=0xc2b2ae35；h^=h>>>16。整数雪崩。',
    en: 'ICE: h=key; h^=h>>>16; h*=0x85ebca6b; h^=h>>>13; h*=0xc2b2ae35; h^=h>>>16. Integer avalanche.',
  },
  tags: ['hashing', 'integer', 'avalanche'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

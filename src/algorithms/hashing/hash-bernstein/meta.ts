// hash-bernstein · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-bernstein',
  categoryId: 'hashing',
  title: { zh: 'Bernstein 哈希', en: 'Bernstein Hash' },
  summary: {
    zh: 'Bernstein 经典变体 hash*33^c（XOR 版 DJB2）。',
    en: 'Bernstein classic variant hash*33^c (the XOR variant of DJB2).',
  },
  description: {
    zh: 'Bernstein 哈希（DJB2 的 XOR 变种）：\n\n- 初始 hash = 5381。\n- 每字节：hash = ((hash << 5) + hash) ^ c。\n- 与 DJB2 相比用异或代替加法，分布略有不同。',
    en: 'Bernstein hash (the XOR variant of DJB2):\n\n- Start hash = 5381.\n- Per byte: hash = ((hash << 5) + hash) ^ c.\n- Uses XOR instead of addition vs DJB2, slightly different distribution.',
  },
  tags: ['hashing', 'non-cryptographic', 'string'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// PJW ELF Hash（PJW ELF Hash）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-pjw',
  categoryId: 'hashing',
  title: { zh: 'PJW ELF Hash', en: 'PJW ELF Hash' },
  summary: {
    zh: 'ELF 文件符号表哈希：高位影响低位，分散前缀相似字符串。',
    en: 'ELF symbol-table hash: high bits fold into low bits, dispersing similar prefixes.',
  },
  description: {
    zh: 'PJW/ELF Hash：每字节 h=(h<<4)+byte，高 4 位非零则异或回低位并清高 4 位。',
    en: 'PJW/ELF hash: per byte h=(h<<4)+byte; if top nibble nonzero, XOR it back and clear it.',
  },
  tags: ['hashing', 'non-cryptographic', 'elf'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

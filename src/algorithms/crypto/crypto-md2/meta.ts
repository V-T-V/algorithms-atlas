// MD2（MD2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-md2',
  categoryId: 'crypto',
  title: { zh: 'MD2', en: 'MD2' },
  summary: {
    zh: 'MD2：Rivest 8 位哈希，针对 8 位机优化。',
    en: 'MD2: Rivest 8-bit hash optimized for 8-bit machines.',
  },
  description: {
    zh: 'MD2（Rivest 1989）字节级哈希，使用 256 字节伪随机 S 盒（π）与 48 字节状态 X/A/C，针对 8 位机优化。',
    en: 'MD2 (Rivest 1989) is a byte-level hash using a 256-byte pseudorandom S-box (π) and 48-byte state X/A/C; optimized for 8-bit machines.',
  },
  tags: ['crypto', 'md2', 'hash', '8-bit'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

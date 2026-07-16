// MD2（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-md2-impl',
  categoryId: 'hashing',
  title: { zh: 'MD2（简化）', en: 'MD2 (simplified)' },
  summary: {
    zh: 'MD2：Rivest 1989 的 8 位字节级哈希，针对 8 位机优化。',
    en: 'MD2: Rivest 1989 byte-level hash optimized for 8-bit machines.',
  },
  description: {
    zh: 'MD2 是为 8 位处理器设计的密码学哈希。本实现是 256 位简化教学版（非标准 128 位）。',
    en: 'MD2 is a cryptographic hash designed for 8-bit processors. Simplified 256-bit teaching version (non-standard 128-bit).',
  },
  tags: ['hashing', 'cryptographic', 'legacy'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// Jenkins lookup3 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-lookup3',
  categoryId: 'hashing',
  title: { zh: 'Jenkins lookup3', en: 'Jenkins lookup3' },
  summary: {
    zh: 'Bob Jenkins lookup3：32 位，按 12 字节块使用 a/b/c 三寄存器混合。',
    en: 'Bob Jenkins lookup3: 32-bit, mixes a/b/c registers over 12-byte chunks.',
  },
  description: {
    zh: 'lookup3（Bob Jenkins 2006）：用三个寄存器 a, b, c，按 12 字节块混合，最后 finalize。著名的雪崩特性。',
    en: 'lookup3 (Bob Jenkins 2006): uses three registers a, b, c mixed over 12-byte chunks then finalized. Renowned avalanche properties.',
  },
  tags: ['hashing', 'non-crypto', 'jenkins'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

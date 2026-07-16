// Paul Hsieh SuperFast · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-paul-hsieh',
  categoryId: 'hashing',
  title: { zh: 'Paul Hsieh SuperFast', en: 'Paul Hsieh SuperFast Hash' },
  summary: {
    zh: 'Paul Hsieh 的 SuperFast 哈希：按 4 字节块处理，带 get16/rot 移位。',
    en: 'Paul Hsieh SuperFast hash: processes 4-byte chunks with get16 and rotation.',
  },
  description: {
    zh: 'SuperFastHash（Paul Hsieh）：每次处理 4 字节块，结合 16 位读取与复杂移位混合，注重速度。',
    en: 'SuperFastHash (Paul Hsieh): processes 4-byte chunks with 16-bit reads and rotation-heavy mixing, optimized for speed.',
  },
  tags: ['hashing', 'non-crypto'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

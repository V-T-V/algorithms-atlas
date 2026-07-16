// SHAKE128（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-shake128-impl',
  categoryId: 'hashing',
  title: { zh: 'SHAKE128（简化）', en: 'SHAKE128 (simplified)' },
  summary: {
    zh: 'SHAKE128：SHA-3 系列的可扩展输出函数 (XOF)。',
    en: 'SHAKE128: extendable-output function (XOF) from the SHA-3 family.',
  },
  description: {
    zh: 'SHAKE128：基于 Keccak 海绵结构的 XOF，输出长度可任意指定。本实现是 256 位简化教学版。',
    en: 'SHAKE128: XOF based on the Keccak sponge construction, arbitrary output length. Simplified 256-bit teaching version.',
  },
  tags: ['hashing', 'cryptographic', 'sha3', 'xof'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

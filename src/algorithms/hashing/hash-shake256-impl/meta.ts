// SHAKE256（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-shake256-impl',
  categoryId: 'hashing',
  title: { zh: 'SHAKE256（简化）', en: 'SHAKE256 (simplified)' },
  summary: {
    zh: 'SHAKE256：SHA-3 系列高安全级别的 XOF。',
    en: 'SHAKE256: higher-security XOF from the SHA-3 family.',
  },
  description: {
    zh: 'SHAKE256：与 SHAKE128 同源，更高安全级别（256 位）。简化教学版。',
    en: 'SHAKE256: same family as SHAKE128, higher security level (256-bit). Simplified teaching version.',
  },
  tags: ['hashing', 'cryptographic', 'sha3', 'xof'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

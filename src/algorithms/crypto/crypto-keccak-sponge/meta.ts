// Keccak 海绵结构（Keccak Sponge）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-keccak-sponge',
  categoryId: 'crypto',
  title: { zh: 'Keccak 海绵结构', en: 'Keccak Sponge' },
  summary: { zh: '吸收-挤压的可变长度哈希。', en: 'Absorb-squeeze variable-length hashing.' },
  description: {
    zh: 'Keccak 海绵结构先吸收(rate 分块异或+置换)再挤压输出任意长度，是 SHA-3 的基础框架。',
    en: 'The Keccak sponge absorbs input in rate-sized blocks (XOR + permutation) then squeezes variable-length output; basis of SHA-3.',
  },
  tags: ['crypto', 'keccak', 'sponge', 'sha3'],
  complexity: { time: 'O(n)', space: 'O(r+c)' },
};

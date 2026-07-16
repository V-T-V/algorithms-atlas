// Whirlpool（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-whirlpool-impl',
  categoryId: 'hashing',
  title: { zh: 'Whirlpool（简化）', en: 'Whirlpool (simplified)' },
  summary: {
    zh: 'Whirlpool：512 位 AES-inspired 哈希，NESSIE 选用。',
    en: 'Whirlpool: 512-bit AES-inspired hash selected by NESSIE.',
  },
  description: {
    zh: 'Whirlpool（Barreto/Rijmen）：基于 AES S-Box 的 512 位密码学哈希。简化 256 位教学版。',
    en: 'Whirlpool (Barreto/Rijmen): 512-bit cryptographic hash based on the AES S-box. Simplified 256-bit teaching version.',
  },
  tags: ['hashing', 'cryptographic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

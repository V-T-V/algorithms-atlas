// hash-fasthash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-fasthash',
  categoryId: 'hashing',
  title: { zh: 'FastHash', en: 'FastHash' },
  summary: {
    zh: 'FastHash 32 位：每 4 字节混合 + 末尾finalize，追求速度。',
    en: 'FastHash 32-bit: mix per 4 bytes plus a finalize step, optimized for speed.',
  },
  description: {
    zh: 'FastHash（Zilong Tan）：\n\n- 以 4 字节为单元混合：m += k * 0x9e3779b1; m = (m << 19 | m >>> 13); m ^= m >>> 16。\n- 尾部按剩余字节处理。\n- 终态再混合一次输出 32 位。',
    en: 'FastHash (Zilong Tan):\n\n- Mix per 4-byte unit: m += k * 0x9e3779b1; m = (m << 19 | m >>> 13); m ^= m >>> 16.\n- Handle the tail by remaining bytes.\n- Finalize with another mix to emit 32 bits.',
  },
  tags: ['hashing', 'non-cryptographic', 'fast'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// CRC32 校验 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-crc32',
  categoryId: 'bitwise',
  title: { zh: 'CRC32 校验', en: 'CRC32 Checksum' },
  summary: {
    zh: '基于反转多项式 0xEDB88320 的表驱动 CRC32 校验。',
    en: 'Table-driven CRC32 checksum using the reversed polynomial 0xEDB88320.',
  },
  description: {
    zh: 'CRC32（Cyclic Redundancy Check，循环冗余校验）通过多项式除法生成 32 位校验码，广泛用于数据传输错误检测。\n\n本实现采用 IEEE 802.3 标准多项式 0x04C11DB7（反转形式 0xEDB88320），初始值与输出异或 0xFFFFFFFF，是 zlib/PNG 使用的常见变体。\n\n步骤：\n1. 预计算 256 项表\n2. 初值 crc = 0xFFFFFFFF\n3. 对每字节：`crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8)`\n4. 返回 `crc ^ 0xFFFFFFFF`\n\n复杂度 O(n)（n 为字节数）。',
    en: 'CRC32 (Cyclic Redundancy Check) produces a 32-bit checksum via polynomial division, widely used for error detection. This implementation uses the IEEE 802.3 polynomial 0x04C11DB7 (reversed 0xEDB88320) with init/xorout 0xFFFFFFFF (the zlib/PNG variant). O(n) for n input bytes.',
  },
  tags: ['bitwise', 'crc', 'checksum', 'error-detection'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

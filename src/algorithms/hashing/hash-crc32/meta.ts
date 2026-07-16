// CRC32（CRC32）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-crc32',
  categoryId: 'hashing',
  title: { zh: 'CRC32', en: 'CRC32' },
  summary: {
    zh: '循环冗余校验：基于多项式除法检测数据传输错误。',
    en: 'Cyclic redundancy check: polynomial division for detecting transmission errors.',
  },
  description: {
    zh: 'CRC32：把数据视作多项式，除以生成多项式 0xEDB88320（反射），余数即校验码。查表加速。',
    en: 'CRC32: treat data as a polynomial, divide by generator 0xEDB88320 (reflected); remainder is checksum. Table-driven.',
  },
  tags: ['hashing', 'checksum', 'crc'],
  complexity: { time: 'O(n)', space: 'O(256)' },
};

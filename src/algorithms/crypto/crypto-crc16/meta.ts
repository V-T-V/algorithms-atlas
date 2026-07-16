// CRC-16（CRC-16）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-crc16',
  categoryId: 'crypto',
  title: { zh: 'CRC-16', en: 'CRC-16' },
  summary: { zh: '16 位循环冗余校验。', en: '16-bit cyclic redundancy check.' },
  description: {
    zh: 'CRC-16 用 GF(2) 多项式除法生成 16 位校验，广泛用于 Modbus、USB、Bisync 等协议检错。',
    en: 'CRC-16 produces a 16-bit check via GF(2) polynomial division, widely used in Modbus, USB, and Bisync.',
  },
  tags: ['crypto', 'crc', 'checksum'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

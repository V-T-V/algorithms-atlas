// CRC-32（CRC-32）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-crc32',
  categoryId: 'crypto',
  title: { zh: 'CRC-32', en: 'CRC-32' },
  summary: { zh: '32 位循环冗余校验。', en: '32-bit cyclic redundancy check.' },
  description: {
    zh: 'CRC-32(IEEE 802.3 多项式 0xEDB88320)广泛用于 ZIP/PNG/Ethernet 帧检错，硬件友好。',
    en: 'CRC-32 (IEEE 802.3 polynomial) is used in ZIP, PNG, Ethernet frame checks; hardware-friendly.',
  },
  tags: ['crypto', 'crc', 'checksum'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

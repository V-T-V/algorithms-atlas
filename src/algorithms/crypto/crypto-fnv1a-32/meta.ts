// FNV-1a 32 位（FNV-1a 32-bit）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-fnv1a-32',
  categoryId: 'crypto',
  title: { zh: 'FNV-1a 32 位', en: 'FNV-1a 32-bit' },
  summary: { zh: '乘素数再异或的快速哈希。', en: 'XOR-then-multiply fast hash.' },
  description: {
    zh: 'FNV-1a(Fowler-Noll-Vo)每字节先与哈希异或再乘以 FNV 素数，分布均匀，常用于哈希表与校验。',
    en: 'FNV-1a XORs each byte then multiplies by the FNV prime; well-distributed, common in hash tables and checksums.',
  },
  tags: ['crypto', 'hash', 'fnv'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

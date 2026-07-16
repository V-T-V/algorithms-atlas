// One-At-A-Time（One-At-A-Time Hash）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-oaat',
  categoryId: 'hashing',
  title: { zh: 'One-At-A-Time', en: 'One-At-A-Time Hash' },
  summary: {
    zh: 'Jenkins One-At-A-Time：加字节+移位+加法混合，碰撞率低。',
    en: 'Jenkins One-At-A-Time: add byte + shifts + adds; low collision rate.',
  },
  description: {
    zh: 'OAAT：h+=byte; h+=h<<10; h^=h>>>6。结束再 h+=h<<3; h^=h>>>11; h+=h<<15。',
    en: 'OAAT: h+=byte; h+=h<<10; h^=h>>>6. Final: h+=h<<3; h^=h>>>11; h+=h<<15.',
  },
  tags: ['hashing', 'non-cryptographic', 'jenkins'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// Blowfish 完整版（Blowfish Full）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-blowfish-full',
  categoryId: 'crypto',
  title: { zh: 'Blowfish 完整版', en: 'Blowfish Full' },
  summary: {
    zh: 'Blowfish：16 轮 Feistel，密钥相关 S 盒。',
    en: 'Blowfish: 16-round Feistel with key-dependent S-boxes.',
  },
  description: {
    zh: 'Blowfish（Schneier 1993）64 位分组，16 轮 Feistel，P 数组与 S 盒在密钥扩展阶段被改动，对小型分组加密高效。',
    en: 'Blowfish (Schneier 1993): 64-bit block, 16-round Feistel whose P-array and S-boxes are mutated during key schedule; efficient for small messages.',
  },
  tags: ['crypto', 'blowfish', 'feistel', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

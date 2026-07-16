// Blowfish 密钥扩展 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'blowfish-schedule',
  categoryId: 'crypto',
  title: { zh: 'Blowfish 密钥扩展', en: 'Blowfish Key Schedule' },
  summary: {
    zh: 'Blowfish Feistel 的 P 数组与 S 盒初始化。',
    en: 'Initialize the P-array and S-boxes for the Blowfish Feistel network.',
  },
  description: {
    zh: 'Blowfish 是 64 位分组、变长密钥的 Feistel 密码。其密钥扩展先用 π 的十六进制小数部分初始化 P 数组（18 项）与 4 个 S 盒（每盒 256 项），再用密钥流反复加密全零块并覆盖 P、S（每轮加密两次）。本实现演示该初始化流程（用简化的 Feistel 轮函数）。',
    en: 'Blowfish is a 64-bit block, variable-key Feistel cipher. Its key schedule initializes the P-array (18 entries) and four S-boxes (256 each) with the hex digits of π, then repeatedly encrypts the all-zero block with the key stream and overwrites P/S (two encryptions per round). This implementation demonstrates that initialization with a simplified Feistel round function.',
  },
  tags: ['crypto', 'feistel', 'key-schedule'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

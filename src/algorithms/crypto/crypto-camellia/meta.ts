// Camellia（Camellia）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-camellia',
  categoryId: 'crypto',
  title: { zh: 'Camellia', en: 'Camellia' },
  summary: {
    zh: 'Camellia：NTT/Mitsubishi 的 Feistel 分组密码。',
    en: 'Camellia: NTT/Mitsubishi Feistel block cipher.',
  },
  description: {
    zh: 'Camellia（NTT & Mitsubishi）128 位分组 Feistel，与 AES 并列的 CRYPTREC/NESSIE 推荐算法，使用 18/24 轮。',
    en: 'Camellia (NTT & Mitsubishi) is a 128-bit-block Feistel cipher recommended by CRYPTREC/NESSIE alongside AES; uses 18/24 rounds.',
  },
  tags: ['crypto', 'camellia', 'feistel', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

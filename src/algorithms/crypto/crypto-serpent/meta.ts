// Serpent（Serpent）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-serpent',
  categoryId: 'crypto',
  title: { zh: 'Serpent', en: 'Serpent' },
  summary: {
    zh: 'Serpent：AES 候选，32 轮 SPN，保守安全裕度。',
    en: 'Serpent: AES finalist, 32-round SPN, conservative security margin.',
  },
  description: {
    zh: 'Serpent（Anderson 等）128 位分组，32 轮 SPN，每轮 8 个 4×4 S 盒并行 + 线性变换 + 轮密钥异或。',
    en: 'Serpent (Anderson et al.): 128-bit block, 32-round SPN; each round applies 8 parallel 4×4 S-boxes, a linear transform, and a round-key XOR.',
  },
  tags: ['crypto', 'serpent', 'aes-finalist', 'spn'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

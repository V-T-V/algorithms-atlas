// MARS（MARS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-mars',
  categoryId: 'crypto',
  title: { zh: 'MARS', en: 'MARS' },
  summary: {
    zh: 'MARS：IBM AES 候选，分层结构（前向/核心/后向）。',
    en: 'MARS: IBM AES finalist with layered structure (forward/core/backward).',
  },
  description: {
    zh: 'MARS（IBM）128 位分组 AES 候选，分 4 层：密钥加 + 8 轮前向混合 + 16 轮核心 + 8 轮后向混合 + 密钥加。',
    en: 'MARS (IBM) is a 128-bit-block AES finalist with 4 layers: key-add + 8 forward-mix rounds + 16 core rounds + 8 backward-mix rounds + key-add.',
  },
  tags: ['crypto', 'mars', 'aes-finalist', 'layered'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

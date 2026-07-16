// ECB 模式（ECB Mode）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-ecb-mode',
  categoryId: 'crypto',
  title: { zh: 'ECB 模式', en: 'ECB Mode' },
  summary: { zh: '逐块独立加密，最简单。', en: 'Each block encrypted independently.' },
  description: {
    zh: 'ECB(Electronic Codebook)模式对每块明文用同一密钥独立加密，相同明文块产生相同密文块，泄露模式，不推荐。',
    en: 'ECB encrypts each block independently with the same key; identical blocks yield identical ciphertext, leaking patterns.',
  },
  tags: ['crypto', 'ecb', 'mode-of-operation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

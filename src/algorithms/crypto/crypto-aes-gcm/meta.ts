// AES-GCM（AES-GCM）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-aes-gcm',
  categoryId: 'crypto',
  title: { zh: 'AES-GCM', en: 'AES-GCM' },
  summary: {
    zh: 'AES-GCM：认证加密模式，CTR + GHASH 认证。',
    en: 'AES-GCM: authenticated encryption, CTR mode + GHASH tag.',
  },
  description: {
    zh: 'AES-GCM（Galois/Counter Mode）= AES-CTR 加密 + GHASH 多项式认证标签，提供机密性与完整性，是 TLS 1.3 默认 AEAD。',
    en: 'AES-GCM (Galois/Counter Mode) = AES-CTR encryption + GHASH polynomial authentication tag, providing confidentiality and integrity; the TLS 1.3 default AEAD.',
  },
  tags: ['crypto', 'aes', 'gcm', 'aead', 'authenticated'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

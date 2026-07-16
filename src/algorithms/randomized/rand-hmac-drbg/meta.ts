// HMAC DRBG · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-hmac-drbg',
  categoryId: 'randomized',
  title: { zh: 'HMAC DRBG', en: 'HMAC DRBG' },
  summary: {
    zh: 'NIST SP 800-90A 基于 HMAC 的 DRBG：K/V 更新模型（教学简化版）。',
    en: 'A simplified educational HMAC-based DRBG using the K/V update model (NIST SP 800-90A).',
  },
  description: {
    zh: 'HMAC_DRBG 维护密钥 K 与值 V，每次请求：K = HMAC(K, V||0x00); V = HMAC(K, V); 输出 V 的若干位；再 K = HMAC(K, V||0x01); V = HMAC(K, V)。本实现用简化 HMAC。',
    en: 'HMAC_DRBG keeps key K and value V; per request: K = HMAC(K, V||0x00); V = HMAC(K, V); emit leading bits of V; then K = HMAC(K, V||0x01); V = HMAC(K, V). Simplified HMAC here.',
  },
  tags: ['randomized', 'prng', 'drbg', 'hmac', 'nist'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

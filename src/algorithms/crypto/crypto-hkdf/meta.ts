// HKDF 密钥派生（HKDF）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-hkdf',
  categoryId: 'crypto',
  title: { zh: 'HKDF 密钥派生', en: 'HKDF' },
  summary: { zh: 'HMAC 提取-扩展派生密钥。', en: 'HMAC extract-expand key derivation.' },
  description: {
    zh: 'HKDF(RFC 5869)先用 HMAC-Extract 把输入密钥材料压缩为伪随机密钥，再用 HMAC-Expand 扩展到任意长度。',
    en: 'HKDF (RFC 5869) compresses input key material via HMAC-Extract then expands to arbitrary length via HMAC-Expand.',
  },
  tags: ['crypto', 'kdf', 'hkdf', 'hmac'],
  complexity: { time: 'O(l)', space: 'O(1)' },
};

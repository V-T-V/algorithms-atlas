// PBKDF2 密钥派生（PBKDF2）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-pbkdf2',
  categoryId: 'crypto',
  title: { zh: 'PBKDF2 密钥派生', en: 'PBKDF2' },
  summary: { zh: '带迭代次数的口令派生。', en: 'Iterated password-based derivation.' },
  description: {
    zh: 'PBKDF2(RFC 2898)对(口令,盐)反复迭代 HMAC，迭代次数提高暴力破解成本，广泛用于口令存储。',
    en: 'PBKDF2 (RFC 2898) iterates HMAC over (password, salt) to raise brute-force cost; standard for password storage.',
  },
  tags: ['crypto', 'kdf', 'pbkdf2', 'password'],
  complexity: { time: 'O(c)', space: 'O(1)' },
};

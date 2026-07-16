// 扩展仿射密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-affine-extended',
  categoryId: 'crypto',
  title: { zh: '扩展仿射密码', en: 'Extended Affine Cipher' },
  summary: {
    zh: 'E(x)=(a·x+b) mod 26；要求 a 与 26 互素。解密用 a 的模逆元。',
    en: 'E(x)=(a·x+b) mod 26; a must be coprime with 26. Decryption uses the modular inverse of a.',
  },
  description: {
    zh: '扩展支持大小写字母分别映射。a 的合法取值为与 26 互素的整数，共 12 种。',
    en: 'Extended to map upper/lower case separately. Valid a are integers coprime with 26 (12 choices).',
  },
  tags: ['crypto', 'substitution', 'number-theory'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

// RC2 分组密码（RC2 Block Cipher）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-rc2',
  categoryId: 'crypto',
  title: { zh: 'RC2 分组密码', en: 'RC2 Block Cipher' },
  summary: { zh: 'RSA 设计的 64 位分组密码。', en: '64-bit block cipher by RSA Security.' },
  description: {
    zh: 'RC2 是 RSA 公司设计的 64 位分组密码，可变密钥长度(8-1024 位)，曾作为 DES 替代在 S/MIME 中使用。',
    en: 'RC2 is a 64-bit block cipher with variable key length (8-1024 bits), once a DES alternative in S/MIME.',
  },
  tags: ['crypto', 'rc2', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

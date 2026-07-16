// Square 密码（Square Cipher）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-square',
  categoryId: 'crypto',
  title: { zh: 'Square 密码', en: 'Square Cipher' },
  summary: { zh: 'AES 前身，128 位 SPN。', en: 'AES predecessor, 128-bit SPN.' },
  description: {
    zh: 'Square(Daemen/Knudsen)是 128 位分组 SPN，首次提出 integral 攻击，是 AES(Rijndael) 的直接前身。',
    en: 'Square (Daemen/Knudsen) is a 128-bit SPN that introduced the integral attack; direct predecessor of AES (Rijndael).',
  },
  tags: ['crypto', 'square', 'block', 'spn'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

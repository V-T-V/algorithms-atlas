// XXTEA 块密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-xxtea',
  categoryId: 'crypto',
  title: { zh: 'XXTEA 块密码', en: 'XXTEA Block Cipher' },
  summary: {
    zh: '可变长度的块密码：一次加密整个 32 位字数组，无需分组模式。',
    en: 'A variable-length block cipher: encrypts an entire array of 32-bit words at once — no block mode needed.',
  },
  description: {
    zh: '对 n 个字反复迭代，每轮基于左右邻居与密钥混合每个元素，rounds = 6 + 52/n。',
    en: 'Iterates over n words, mixing each element with its neighbors and key each round; rounds = 6 + 52/n.',
  },
  tags: ['crypto', 'block', 'symmetric'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

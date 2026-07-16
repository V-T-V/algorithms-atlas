// CFB 模式（CFB Mode）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-cfb-mode',
  categoryId: 'crypto',
  title: { zh: 'CFB 模式', en: 'CFB Mode' },
  summary: { zh: '前密文加密后与明文异或。', en: 'Encrypts prev ciphertext, XORs plaintext.' },
  description: {
    zh: 'CFB(Cipher Feedback)把上一密文块作为加密输入，输出与明文异或得密文，可将分组密码当流密码用。',
    en: 'CFB feeds the previous ciphertext block into the block cipher and XORs its output with the plaintext, making a stream cipher.',
  },
  tags: ['crypto', 'cfb', 'mode-of-operation', 'stream'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

// 运行密钥密码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'running-key',
  categoryId: 'crypto',
  title: { zh: '运行密钥密码', en: 'Running Key Cipher' },
  summary: {
    zh: '维吉尼亚变体：密钥是长文本（书的一页）。',
    en: 'A Vigenère variant whose key is a long text (e.g., a page of a book).',
  },
  description: {
    zh: '运行密钥密码本质是维吉尼亚密码，但密钥不是反复循环的短词，而是一段与明文等长的「运行密钥」（常取自一本书的某页），故密钥不重复、不暴露周期。公式 C_i = (P_i + K_i) mod 26。安全性依赖密钥文本的不可预测与一次性。',
    en: 'The running key cipher is essentially Vigenère, but instead of a short cycling key word the key is a "running key" as long as the plaintext (often a passage from a book), so the key never repeats and exposes no period. C_i = (P_i + K_i) mod 26. Security rests on the unpredictability and one-time use of the key text.',
  },
  tags: ['crypto', 'substitution', 'polyalphabetic', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

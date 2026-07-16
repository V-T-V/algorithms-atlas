// 自动密钥密码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'autokey-cipher',
  categoryId: 'crypto',
  title: { zh: '自动密钥密码', en: 'Autokey Cipher' },
  summary: {
    zh: '密钥 = 引子 + 明文自身延伸，避免周期性。',
    en: 'Key = primer + the plaintext itself extended, avoiding periodicity.',
  },
  description: {
    zh: '自动密钥密码（Vigenère 变体）用一个短引子开头，其后把明文自身追加为密钥流的延续，故密钥无周期。C_i = (P_i + K_i) mod 26，其中 K = primer + P[0..n-primerLen)。解密先解引子段，再滚动用已还原的明文继续解后续。',
    en: 'The autokey cipher (a Vigenère variant) starts with a short primer, then appends the plaintext itself as the continuation of the key stream, removing periodicity. C_i = (P_i + K_i) mod 26 with K = primer + P[0..n-primerLen). Decryption first recovers the primer block, then rolls the recovered plaintext forward as the key.',
  },
  tags: ['crypto', 'substitution', 'polyalphabetic', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

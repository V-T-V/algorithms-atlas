// Atbash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'atbash',
  categoryId: 'crypto',
  title: { zh: 'Atbash 反向字母密码', en: 'Atbash Cipher' },
  summary: {
    zh: '字母表首尾对调（A↔Z、B↔Y …），自对合。',
    en: 'Reverses the alphabet (A↔Z, B↔Y …); involutive.',
  },
  description: {
    zh: 'Atbash 是古老的希伯来替换密码：把字母表镜像翻转，A↔Z、B↔Y、c↔x 等。映射 c → (25 - (c-A)) + A。它自对合，故加密=解密。非字母字符保留。',
    en: 'Atbash is an ancient Hebrew substitution cipher that mirrors the alphabet: A↔Z, B↔Y, c↔x. The map is c → (25 - (c-A)) + A. It is involutive, so encryption equals decryption. Non-letters are preserved.',
  },
  tags: ['crypto', 'substitution', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

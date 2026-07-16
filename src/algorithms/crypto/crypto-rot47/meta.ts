// ROT47 密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-rot47',
  categoryId: 'crypto',
  title: { zh: 'ROT47 密码', en: 'ROT47 Cipher' },
  summary: {
    zh: '把可打印 ASCII（33–126）旋转 47 位，加密两次即还原。',
    en: 'Rotate printable ASCII (33–126) by 47 positions; applying twice restores the original.',
  },
  description: {
    zh: '对每个 ASCII 33–126 的字符加 47，越过 126 则回绕。能同时混淆数字与标点，ROT13 的增强版。',
    en: 'Each ASCII char 33–126 shifts by 47, wrapping past 126. Obfuscates digits and punctuation too.',
  },
  tags: ['crypto', 'substitution', 'ascii'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

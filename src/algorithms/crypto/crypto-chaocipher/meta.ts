// 混沌密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-chaocipher',
  categoryId: 'crypto',
  title: { zh: '混沌密码', en: 'Chaocipher' },
  summary: {
    zh: 'J.F. Byrne 设计的自密钥流密码：两个字母表随每次加密同步扰动。',
    en: 'A self-keyrunning stream cipher by J.F. Byrne: two alphabets are permuted after each encipherment.',
  },
  description: {
    zh: '在明文字母表找到明文字母位置，取密文字母表同位置字符；再按固定切点旋转两表。',
    en: 'Find the plaintext index in the plain alphabet, take the cipher alphabet char at that index; then rotate both alphabets at fixed zenith/nadir points.',
  },
  tags: ['crypto', 'stream', 'self-keyrunning'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

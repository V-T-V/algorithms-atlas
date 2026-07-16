// SHARK 密码（SHARK）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-shark',
  categoryId: 'crypto',
  title: { zh: 'SHARK 密码', en: 'SHARK' },
  summary: { zh: 'AES 前身的 SPN。', en: 'SPN predecessor of AES.' },
  description: {
    zh: 'SHARK(Rijmen 等早期 SPN)使用 GF(2^8) 上的扩散矩阵与 S 盒，是 Rijndael 的重要技术源头。',
    en: 'SHARK (Rijmen et al.) uses GF(2^8) diffusion matrices and S-boxes, a key technical source for Rijndael.',
  },
  tags: ['crypto', 'shark', 'spn', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

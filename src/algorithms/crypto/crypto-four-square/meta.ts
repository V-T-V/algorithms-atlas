// 四方密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-four-square',
  categoryId: 'crypto',
  title: { zh: '四方密码', en: 'Four-Square Cipher' },
  summary: {
    zh: '四个 5×5 方阵：左上右下为标准字母表，右上左下由关键字生成，成对字母双向加密。',
    en: 'Four 5×5 squares: top-left and bottom-right standard, top-right and bottom-left keyed; encrypts digraphs bi-axially.',
  },
  description: {
    zh: '把明文分成字母对 (a,b)。a 在 TL 找 (r1,c1)，b 在 BR 找 (r2,c2)，密文 = TR[r1,c2] + BL[r2,c1]。',
    en: 'Split plaintext into digraphs (a,b). a→(r1,c1) in TL, b→(r2,c2) in BR; ciphertext = TR[r1,c2] + BL[r2,c1].',
  },
  tags: ['crypto', 'digraph', 'classical'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

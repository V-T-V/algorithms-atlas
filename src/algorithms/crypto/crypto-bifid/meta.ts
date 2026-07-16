// Bifid 双方阵密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-bifid',
  categoryId: 'crypto',
  title: { zh: 'Bifid 双方阵密码', en: 'Bifid Cipher' },
  summary: {
    zh: '5×5 Polybius 分数化后，把行坐标与列坐标分成两行再按列读取重组。',
    en: 'Fractionate via a 5×5 Polybius square, split row/col coordinates into two lines, then read columns to recombine.',
  },
  description: {
    zh: '坐标拆成两行后横向拼接、再纵向两两成对回查方阵，实现扩散效果。',
    en: 'Split coordinates into two rows, concatenate horizontally, then pair vertically to map back — providing diffusion.',
  },
  tags: ['crypto', 'fractionation', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

// Trifid 三方阵密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-trifid',
  categoryId: 'crypto',
  title: { zh: 'Trifid 三方阵密码', en: 'Trifid Cipher' },
  summary: {
    zh: '把 27 字符排进 3 层 3×3 立方体，每字符分数化为 3 个坐标，按周期重组。',
    en: 'Arrange 27 symbols in a 3-layer 3×3 cube; each char fractionates into 3 coordinates, regrouped by period.',
  },
  description: {
    zh: '每字符 → (层,行,列)。把一个周期内所有层坐标、行坐标、列坐标分别串接，再纵向三三成组回查。',
    en: 'Each char → (layer,row,col). Within a period, concatenate all layers, rows, cols separately, then regroup in triples to look up.',
  },
  tags: ['crypto', 'fractionation', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

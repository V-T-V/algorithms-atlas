// 独热编码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-one-hot-encode',
  categoryId: 'ml',
  title: { zh: '独热编码', en: 'One-Hot Encoding' },
  summary: { zh: '把类别标签转为独热向量。', en: 'Convert categorical labels to one-hot vectors.' },
  description: {
    zh: '对 k 类，标签 i → 长度 k、第 i 位为 1 其余为 0。',
    en: 'For k classes, label i → length-k vector with 1 at position i.',
  },
  tags: ['ml', 'preprocessing'],
  complexity: { time: 'O(n)', space: 'O(nk)' },
};

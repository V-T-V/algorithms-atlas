// Count-Min Sketch · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'count-min-sketch',
  categoryId: 'hashing',
  title: { zh: 'Count-Min Sketch', en: 'Count-Min Sketch' },
  summary: {
    zh: '二维计数草图：d 个哈希 × w 列取最小值，估计元素频率（只高估）。',
    en: 'A 2-D counting sketch: d hashes × w columns, take the min to estimate frequency (never underestimates).',
  },
  description: {
    zh: 'Count-Min Sketch（Cormode & Misha 2003/2004）用 d 行 × w 列的计数矩阵估计数据流中元素的频率。每次更新元素 x：对每行 i 用独立哈希 h_i 把 x 映射到列 j，令 count[i][j] += c。查询频率时返回 min_i count[i][h_i(x)]。由于只增不减，估计值永远 ≥ 真实值（只高估，无低估）。误差界限：以 ≥ 1−δ 的概率，估计误差 ≤ ε·N，其中 w=⌈e/ε⌉、d=⌈ln(1/δ)⌉、N 为总流量。内存 O(dw)，远小于精确计数。常用于热门词频、Top-K、heavy hitters。',
    en: 'The Count-Min Sketch (Cormode & Misha 2003/2004) uses a d×w counting matrix to estimate element frequency in a stream. To update element x: for each row i, hash x with an independent h_i to column j and increment count[i][j] by c. To query, return min_i count[i][h_i(x)]. Since counts only increase, the estimate is always ≥ the true value (overestimate only). Error bound: with probability ≥ 1−δ, the error is ≤ ε·N where w=⌈e/ε⌉, d=⌈ln(1/δ)⌉, and N is total volume. Memory O(dw), far smaller than exact counting. Widely used for hot-term frequency, Top-K, and heavy-hitter detection.',
  },
  tags: ['hashing', 'frequency-estimation', 'streaming', 'probabilistic'],
  complexity: { time: 'O(d) per op', space: 'O(d·w)' },
};

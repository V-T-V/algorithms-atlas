// 第 K 个语法符号（LeetCode 779）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'k-th-symbol',
  categoryId: 'recursion',
  title: { zh: '第 K 个语法符号（779）', en: 'K-th Symbol in Grammar (779)' },
  summary: {
    zh: '第 n 行由上一行翻转得到；递归找 k 位与首行第 ceil(k/2) 位的关系。',
    en: 'Row n+1 = row n followed by its bitwise complement; recurse via ceil(k/2).',
  },
  description: {
    zh: '构造规则：\n- 第 1 行 = "0"\n- 第 n 行 = 第 n−1 行 + （第 n−1 行按位取反）\n\n求第 n 行第 k 个符号（1-based）。直接构造会指数级膨胀。利用递归结构：第 n 行前半部分 = 第 n−1 行，后半部分 = 第 n−1 行取反。因此：\n- 若 k 在前半（k ≤ 2^(n−2)），则等于第 n−1 行第 k 个\n- 若 k 在后半，则等于「第 n−1 行第 (k − 2^(n−2)) 个的取反」\n\n递归到 n=1 返回 0。时间 O(n)，空间 O(n)。',
    en: 'Row 1 = "0"; row n = row n-1 concatenated with its bitwise complement. To get the k-th symbol of row n: if k is in the first half, recurse into row n-1 at k; if in the second half, recurse into row n-1 at k - 2^(n-2) and flip. Base n=1 returns 0. O(n) time and space.',
  },
  tags: ['recursion', 'leetcode', 'grammar', 'binary'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

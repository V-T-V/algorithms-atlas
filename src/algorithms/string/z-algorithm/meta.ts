// Z Algorithm · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'z-algorithm',
  categoryId: 'string',
  title: { zh: 'Z 算法', en: 'Z Algorithm' },
  summary: {
    zh: '线性时间构造 Z 数组：z[i] = s 与 s[i..] 的最长公共前缀长度。',
    en: 'Builds the Z array in linear time: z[i] = longest common prefix of s and s[i..].',
  },
  description: {
    zh: 'Z 算法（Z Algorithm）在 O(n) 内对字符串 s 计算出 Z 数组：z[i] 表示 s 与 s[i..] 的最长公共前缀长度（z[0] 通常约定为 0 或 n）。\n\n核心思想是维护一个「Z-box」[L, R]——当前已知延伸最右的前缀匹配区间。处理位置 i 时：若 i <= R，则用 z[i-L] 作为初值（利用已匹配信息避免重复比较），再按需向右扩展；若 i > R 则从头暴力比较并更新 Z-box。\n\nZ 数组可直接用于模式匹配：构造 pat + "#" + txt 的 Z 数组，凡 z[i] == |pat| 处即一处匹配。也可用于字符串周期性、去重等。时间 O(n)，空间 O(n)。',
    en: 'The Z Algorithm computes, in O(n), the Z array of a string s: z[i] is the length of the longest common prefix of s and s[i..] (z[0] is conventionally 0 or n).\n\nThe core idea maintains a "Z-box" [L, R] — the rightmost prefix-matching interval seen so far. For position i: if i <= R, seed with z[i-L] (reusing prior matches to avoid re-comparing) and extend as needed; if i > R, compare naively and update the Z-box.\n\nThe Z array directly supports pattern matching: build the Z array of pat + "#" + txt; every index with z[i] == |pat| is a match. Also used for periodicity and deduplication. Time O(n), space O(n).',
  },
  tags: ['string', 'z-array', 'lcp', 'linear', 'pattern-matching'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

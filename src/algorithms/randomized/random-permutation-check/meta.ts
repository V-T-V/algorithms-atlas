// 随机排列生成与校验 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'random-permutation-check',
  categoryId: 'randomized',
  title: { zh: '随机排列生成与校验', en: 'Random Permutation Generation & Verification' },
  summary: {
    zh: 'Fisher-Yates 生成 [0,n) 的均匀随机排列，再用指纹和/计数法 O(n) 校验是否为合法排列。',
    en: 'Generate a uniform random permutation of [0,n) with Fisher-Yates, then verify it is a valid permutation in O(n) via fingerprints or counting.',
  },
  description: {
    zh: '本算法演示随机排列的两大核心操作。**生成**：Fisher-Yates 洗牌（Knuth 等价形式）从 i=n−1 倒推到 0，每次从 [0, i] 均匀随机取一个下标 j 与位置 i 交换，得到的排列在全部 n! 种排列上完全均匀。**校验**：给定一个长度 n 的数组，判断它是否恰是 [0,n) 的一个排列。两种做法：(1) 布尔计数法——开一个 seen[] 数组，遍历一次标记每个值，遇到越界值或重复值则非法，O(n) 时间 O(n) 空间；(2) 指纹法（随机化）——预先算出 [0,n) 的元素之和与平方和（或一个随机多项式哈希），与待校验数组的和比对，O(n) 时间 O(1) 空间但有极小碰撞概率。本实现提供两种校验，并演示「合法排列」「含重复值」「含越界值」三类输入。',
    en: "This algorithm illustrates two core operations on random permutations. **Generation**: the Fisher-Yates shuffle (Knuth's equivalent form) iterates i from n−1 down to 0, each time picking a uniformly random index j in [0, i] and swapping positions i and j; the resulting permutation is perfectly uniform over all n! possibilities. **Verification**: given an array of length n, decide whether it is exactly a permutation of [0,n). Two methods: (1) the boolean counting method — allocate a seen[] array, scan once marking each value, flagging out-of-range or duplicate values as invalid, O(n) time and O(n) space; (2) the fingerprint method (randomized) — precompute the sum and sum-of-squares (or a random polynomial hash) of [0,n) and compare with the candidate, O(n) time and O(1) space but with a tiny collision probability. This implementation provides both verifications and demonstrates three input classes: valid permutation, with duplicates, and with out-of-range values.",
  },
  tags: ['randomized', 'permutation', 'fisher-yates', 'verification'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

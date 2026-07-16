// 元二分查找（逐位构造） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-meta-bit',
  categoryId: 'searching',
  title: { zh: '元二分查找（逐位构造）', en: 'Meta Binary Search (Bit-by-Bit)' },
  summary: {
    zh: '从最高位起逐位构造候选下标，比较后决定该位置 0 或 1。',
    en: 'Build the candidate index bit by bit from the MSB, comparing to decide each bit.',
  },
  description: {
    zh: '元二分查找（Meta Binary Search / One-Sided Binary Search）从最高有效位起，逐位尝试把候选下标 p 的某位置 1，若 arr[p] <= target 则保留该位（继续累加），否则清零。最终 p 收敛到 <= target 的最大下标。若 arr[p]==target 即命中。所有比较只针对下标的二进制位，O(log n) 次。空间 O(1)。需先算最高位 lg(n)。',
    en: 'Meta binary search (one-sided) starts from the most significant bit and tries setting each bit of the candidate index p; if arr[p] <= target keep that bit (accumulate), else clear it. p converges to the largest index with arr[p] <= target. If arr[p]==target it is a hit. All comparisons target individual bits of the index, O(log n) of them. Space O(1). Requires computing the MSB position lg(n) first.',
  },
  tags: ['searching', 'meta-binary', 'bitwise', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};

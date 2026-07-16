// Sattolo 算法（随机环排列）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-shuffle-sattolo-2',
  categoryId: 'randomized',
  title: { zh: 'Sattolo 算法（随机环排列）', en: "Sattolo's Algorithm (Random Cycle)" },
  summary: {
    zh: 'Fisher-Yates 的变体，生成一个含单个循环的随机排列（每个元素指向下一个，构成一个环）。',
    en: 'A Fisher-Yates variant that produces a random permutation consisting of a single cycle (each element points to the next, forming one loop).',
  },
  description: {
    zh: 'Sattolo 算法：对 i 从 n-1 到 1，随机选 j ∈ [0, i)（注意上界不含 i，与 Fisher-Yates [0,i] 不同），交换 a[i],a[j]。结果是一个随机环排列：从任一元素出发按值索引跟踪，必经所有元素回到起点。',
    en: "Sattolo's algorithm: for i from n-1 down to 1, pick j in [0, i) (note the upper bound excludes i, unlike Fisher-Yates [0,i]), swap a[i],a[j]. The result is a random cycle: starting anywhere and following value-indices visits every element and returns to the start.",
  },
  tags: ['randomized', 'shuffle', 'permutation', 'cycle'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'collatz-steps',
  categoryId: 'math',
  title: { zh: 'Collatz 步数', en: 'Collatz Steps' },
  summary: {
    zh: '按 3n+1 规则迭代到 1，统计步数与轨迹。',
    en: 'Iterate the 3n+1 rule to reach 1; count steps and record the trajectory.',
  },
  description: {
    zh: 'Collatz 猜想（3n+1 问题）：对任意正整数 n，若 n 为偶数则除以 2，若为奇数则变为 3n+1；反复操作最终必回到 1（猜想，未被证明但已验证到极大数）。本实现模拟该过程，记录从 n 到 1 的完整轨迹及所需步数（停止时间），并可统计区间 [1,n] 中步数最大的「记录保持者」。每个 n 的步数时间约为 O(步数)。',
    en: 'The Collatz (3n+1) conjecture: from any positive n, halve it if even or map to 3n+1 if odd, iterating until reaching 1 (conjectured always to terminate). This implementation simulates the process, recording the full trajectory and the stopping time (step count), and can find the record holder with the most steps in [1,n]. Time per n is about O(steps).',
  },
  tags: ['math', 'number-theory', 'collatz', 'sequence', 'conjecture'],
  complexity: { time: 'O(步数)', space: 'O(步数)' },
};

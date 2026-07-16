// Peterson Algorithm · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'peterson-algorithm',
  categoryId: 'concurrency',
  title: { zh: 'Peterson 算法', en: 'Peterson Algorithm' },
  summary: {
    zh: '两线程互斥经典：flag[2] + turn，进入前谦让，保证互斥且无饥饿。',
    en: 'Classic two-thread mutual exclusion: flag[2] + turn, with courteous handoff ensuring mutual exclusion and starvation-freedom.',
  },
  description: {
    zh: 'Peterson 算法（G. L. Peterson, 1981）是两线程互斥的精巧解法，仅用两个标志位 `flag[0]`、`flag[1]` 和一个轮次变量 `turn`：\n\n```\nflag[i] = true;     // 我想进入\nturn = 1 - i;       // 但让对方先\nwhile (flag[1-i] && turn == 1-i);  // 等到对方不想进 或 轮到我\n// 临界区\nflag[i] = false;    // 退出\n```\n\n核心是「想进 + 谦让」：双方都想进时，`turn` 决定谁让步。该算法同时满足：\n- **互斥性**：两线程不可能同时进入临界区\n- **进展性**：若临界区空闲，想进者终能进入\n- **有限等待**：不会有线程无限期被挡（无饥饿）\n\n本实现以「步骤序列」确定性模拟两个线程的 lock/critical/unlock，便于验证互斥。',
    en: "Peterson's algorithm (G. L. Peterson, 1981) is an elegant two-thread mutual exclusion solution using just two flags `flag[0]`, `flag[1]` and a turn variable `turn`:\n\n```\nflag[i] = true;     // I want in\nturn = 1 - i;       // but let the other go first\nwhile (flag[1-i] && turn == 1-i);  // wait until other doesn't want in or it's my turn\n// critical section\nflag[i] = false;    // leave\n```\n\nThe crux is 'want in + yield': when both want in, `turn` decides who yields. It simultaneously guarantees:\n- **Mutual exclusion**: both threads can never be in the critical section at once\n- **Progress**: if the section is free, a waiting thread eventually enters\n- **Bounded waiting**: no thread is blocked forever (starvation-free)\n\nThis implementation deterministically simulates both threads' lock/critical/unlock as a step sequence, for verifying mutual exclusion.",
  },
  tags: ['concurrency', 'mutual-exclusion', 'two-thread'],
  complexity: { time: 'O(1) per step', space: 'O(1)' },
  attributes: { model: '步骤序列模拟 / step-sequence simulation' },
  references: [
    {
      label: 'Peterson, G. L. (1981). Myths about the mutual exclusion problem.',
      url: 'https://doi.org/10.1016/0022-0000(81)90031-X',
    },
  ],
};

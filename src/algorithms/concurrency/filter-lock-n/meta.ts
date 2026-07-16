// n 线程过滤锁（Filter Lock）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'filter-lock-n',
  categoryId: 'concurrency',
  title: { zh: 'n 线程过滤锁', en: 'Filter Lock (n threads)' },
  summary: {
    zh: 'Peterson 的 n 线程推广：经 n-1 层「等待室」逐层过滤，最后进入临界区。',
    en: 'Generalizes Peterson to n threads: filters through n-1 waiting levels before the critical section.',
  },
  description: {
    zh: 'Filter Lock 是 Peterson 算法向 n 线程的经典推广（Herlihy & Shavit）。它设置 n-1 个「等待层」level[0..n-1]，每个线程从 level 0 逐层推进：\n\n```\nfor (L = 1; L < n; L++) {\n  level[i] = L;            // 我在第 L 层\n  victim[L] = i;           // 让步位\n  while (∃k≠i: level[k] >= L && victim[L] == i) {} // 等到没人或轮不到我谦让\n}\n// 临界区\nlevel[i] = 0;\n```\n\n每层至多 n-L 个线程，因此逐层把竞争者减少，第 n-1 层只剩 1 个线程。满足：\n- **互斥性**：同一层 victim 机制保证不会两个线程同时穿过\n- **无饥饿**（有界等待）： victim 轮转\n- **无死锁**：总有某线程能在当前最高层前进\n\n本实现用确定性步骤序列模拟 n 线程在各层的推进与等待。',
    en: 'The Filter Lock is the classic n-thread generalization of Peterson (Herlihy & Shavit). It uses n-1 waiting levels level[0..n-1]; each thread climbs from level 0:\n\n```\nfor (L = 1; L < n; L++) {\n  level[i] = L;\n  victim[L] = i;\n  while (exists k!=i: level[k] >= L && victim[L] == i) {}\n}\n// critical section\nlevel[i] = 0;\n```\n\nAt most n-L threads occupy level L, so contention thins each level until only 1 remains at level n-1. Guarantees:\n- **Mutual exclusion**: victim mechanism prevents two threads passing a level together\n- **Starvation-free** (bounded waiting): victim rotation\n- **Deadlock-free**: some thread always progresses at the highest occupied level\n\nThis implementation deterministically simulates n threads climbing levels as a step sequence.',
  },
  tags: ['concurrency', 'mutual-exclusion', 'n-thread', 'filter-lock'],
  complexity: { time: 'O(n) per lock', space: 'O(n)' },
  attributes: { model: '步骤序列模拟 / step-sequence simulation' },
};

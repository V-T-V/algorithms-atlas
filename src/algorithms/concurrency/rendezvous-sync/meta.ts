// 汇合点同步（两线程对称交换）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rendezvous-sync',
  categoryId: 'concurrency',
  title: { zh: '汇合点同步（对称交换）', en: 'Rendezvous (Symmetric Exchange)' },
  summary: {
    zh: '两线程用两把信号量在汇合点对称等待，全部到达后才一起通过。',
    en: 'Two threads wait symmetrically at a rendezvous using two semaphores, passing only after both arrive.',
  },
  description: {
    zh: '汇合点（rendezvous）要求两个线程都执行到「到达点」后，才能继续向后执行——即 a1 必须先于 b2，b1 必须先于 a2。\n\n用两把初始为 0 的信号量即可对称实现：\n\n```\n// 线程 A              // 线程 B\na1;\nsignal(aArrived);     b1;\nwait(bArrived);       signal(bArrived);\na2;                   wait(aArrived);\n                       b2;\n```\n\n关键性质：\n- **对称性**：双方都先 signal 自己的到达，再 wait 对方的到达，避免死锁\n- **无饥饿**：任一方到达后 signal 非阻塞，对方终能等到\n- 若颠倒成先 wait 后 signal，两线程互相等待则会死锁——这是经典反面教材\n\n本实现以步骤序列模拟 A/B 两线程的 arrive/proceed 事件，验证 a1≺b2 且 b1≺a2。',
    en: 'A rendezvous requires both threads to reach their arrival point before either proceeds: a1 must precede b2, and b1 must precede a2.\n\nTwo semaphores initialized to 0 implement it symmetrically:\n\n```\n// Thread A           // Thread B\na1;\nsignal(aArrived);    b1;\nwait(bArrived);      signal(bArrived);\na2;                  wait(aArrived);\n                      b2;\n```\n\nKey properties:\n- **Symmetry**: each signals its own arrival before waiting for the other, avoiding deadlock\n- **Starvation-free**: signaling is non-blocking, so the peer eventually proceeds\n- Reversing to wait-then-signal deadlocks both threads — a classic pitfall\n\nThis implementation simulates A/B arrive/proceed events as a step sequence, verifying a1≺b2 and b1≺a2.',
  },
  tags: ['concurrency', 'synchronization', 'rendezvous', 'semaphore'],
  complexity: { time: 'O(1) per step', space: 'O(1)' },
  attributes: { model: '步骤序列模拟 / step-sequence simulation' },
};

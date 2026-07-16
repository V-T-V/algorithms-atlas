// 时间片轮转（可变量子）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-rr-quantum-2',
  categoryId: 'scheduling',
  title: { zh: '时间片轮转（可变量子）', en: 'Round Robin (Variable Quantum)' },
  summary: {
    zh: '每个进程按时间片轮转执行；可对不同进程或优先级使用不同长度的时间片。',
    en: 'Each process runs in turn for a time slice; different quantum lengths may be used per process or priority.',
  },
  description: {
    zh: '维护就绪队列。每轮从队首取一个进程，运行 min(quantum, remaining) 时间，然后若未完成则放回队尾。可变量子版允许每个进程携带自己的 quantum，模拟优先级差异化。计算完成时间、等待时间、周转时间。',
    en: 'Maintain a ready queue. Each turn pops the head and runs for min(quantum, remaining); if not done it goes to the tail. The variable-quantum variant lets each process carry its own quantum, emulating priority differentiation. We compute completion, waiting, and turnaround times.',
  },
  tags: ['scheduling', 'round-robin', 'time-quantum', 'fairness'],
  complexity: { time: 'O(n * 总时间/quantum)', space: 'O(n)' },
};

// Futex 快速用户态互斥（Futex）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-futex',
  categoryId: 'concurrency',
  title: { zh: 'Futex 快速用户态互斥', en: 'Futex' },
  summary: {
    zh: '用户态自旋，仅争用时陷入内核。',
    en: 'User-space spin, kernel call only on contention.',
  },
  description: {
    zh: 'Futex(Fast Userspace Mutex, Linux)在用户态用原子变量快速路径加锁，仅当需要等待/唤醒时才 syscall 进入内核，性能极高。',
    en: 'Futex uses an atomic for a fast user-space path, falling back to a kernel syscall only when blocking/waking is needed.',
  },
  tags: ['concurrency', 'futex', 'mutex'],
  complexity: { time: 'O(1) uncontended', space: 'O(1)' },
};

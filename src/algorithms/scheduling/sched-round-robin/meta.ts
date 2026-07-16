// 时间片轮转 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-round-robin',
  categoryId: 'scheduling',
  title: { zh: '时间片轮转', en: 'Round Robin' },
  summary: {
    zh: '每个进程分配固定时间片，轮流执行。',
    en: 'Each process gets a fixed quantum, taking turns.',
  },
  description: {
    zh: 'FIFO 队列，到时间片末尾回队尾。',
    en: 'FIFO queue, requeue at quantum end. O(n*total).',
  },
  tags: ['scheduling', 'round-robin'],
  complexity: { time: 'O(n*total)', space: 'O(n)' },
};

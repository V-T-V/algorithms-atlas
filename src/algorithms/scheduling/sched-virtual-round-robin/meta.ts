// 虚拟轮转 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-virtual-round-robin',
  categoryId: 'scheduling',
  title: { zh: '虚拟轮转', en: 'Virtual Round Robin' },
  summary: {
    zh: 'I/O 阻塞进程进入更高优先级队列。',
    en: 'I/O-blocked processes get a higher-priority queue.',
  },
  description: {
    zh: 'I/O 完成后入辅助队列优先调度。',
    en: 'After I/O, enter aux queue first. O(n*total).',
  },
  tags: ['scheduling', 'round-robin', 'io'],
  complexity: { time: 'O(n*total)', space: 'O(n)' },
};

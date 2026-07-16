// I/O密集型优先 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-io-bound-favor',
  categoryId: 'scheduling',
  title: { zh: 'I/O密集型优先', en: 'I/O Bound Favoring' },
  summary: {
    zh: 'I/O 密集（短 CPU 段）的进程优先。',
    en: 'Favor I/O-bound (short CPU burst) processes.',
  },
  description: { zh: '按 burst 长度升序，短的优先。', en: 'Sort by burst asc. O(n log n).' },
  tags: ['scheduling', 'io'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

// FCFS带切换开销 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-fcfs-overhead',
  categoryId: 'scheduling',
  title: { zh: 'FCFS带切换开销', en: 'FCFS with Context Switch Overhead' },
  summary: { zh: 'FCFS 加上进程切换固定开销。', en: 'FCFS with fixed context-switch overhead.' },
  description: { zh: '每次切换加 overhead 时间。', en: 'Add overhead on each switch. O(n).' },
  tags: ['scheduling', 'fcfs', 'overhead'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

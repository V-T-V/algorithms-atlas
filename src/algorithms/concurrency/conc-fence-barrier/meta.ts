// 内存屏障（模型）（Memory Fence Model）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-fence-barrier',
  categoryId: 'concurrency',
  title: { zh: '内存屏障（模型）', en: 'Memory Fence Model' },
  summary: { zh: '禁止前后指令重排序。', en: 'Forbids reordering across the fence.' },
  description: {
    zh: '内存屏障(load/store fence)禁止编译器与 CPU 跨屏障重排序，保证弱内存模型(ARM/POWER)上的 happens-before。',
    en: 'A memory fence forbids the compiler/CPU from reordering loads/stores across it, enforcing happens-before on weak memory models.',
  },
  tags: ['concurrency', 'memory-fence', 'memory-model'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

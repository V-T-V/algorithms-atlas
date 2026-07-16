// Happens-Before 关系（Happens-Before Relation）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-happens-before',
  categoryId: 'concurrency',
  title: { zh: 'Happens-Before 关系', en: 'Happens-Before Relation' },
  summary: { zh: '推导事件间的可见性偏序。', en: 'Infers visibility partial order among events.' },
  description: {
    zh: 'Happens-Before 关系由程序序、监视器锁、volatile、线程 start/join 等组合传递闭包，决定多线程可见性与重排序边界。',
    en: 'Happens-before is the transitive closure of program order, locks, volatile, start/join; it defines visibility and reordering limits.',
  },
  tags: ['concurrency', 'memory-model', 'happens-before'],
  complexity: { time: 'O(e^3)', space: 'O(e^2)' },
};

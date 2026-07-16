// 两阶段提交 2PC（Two-Phase Commit）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-two-phase-commit',
  categoryId: 'concurrency',
  title: { zh: '两阶段提交 2PC', en: 'Two-Phase Commit' },
  summary: { zh: '协调者 prepare + commit。', en: 'Coordinator prepare then commit.' },
  description: {
    zh: '两阶段提交(2PC)协调者先向所有参与者发 prepare，全部 YES 才发 commit，否则 abort，保证原子性但有阻塞风险。',
    en: 'Two-phase commit (2PC) coordinator first asks participants to prepare; on all-YES it commits, otherwise aborts; atomic but blocking on failure.',
  },
  tags: ['concurrency', '2pc', 'distributed-transaction'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

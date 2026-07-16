// 顺序锁（Sequence Lock）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-sequence-lock',
  categoryId: 'concurrency',
  title: { zh: '顺序锁', en: 'Sequence Lock' },
  summary: {
    zh: 'SeqLock：读者无锁读，校验前后序号一致；写者持锁时序号变奇。',
    en: 'SeqLock: readers read locklessly, validating sequence parity; writers flip sequence to odd while writing.',
  },
  description: {
    zh: '顺序锁（Lamport-style）用于读多写少场景：读者读取数据并记录序号；若序号为奇数（写者正在写）或读后序号变化则重读。写者进入时序号变奇，退出变偶。',
    en: 'Sequence lock (used for read-mostly workloads): readers read data and record the sequence; they retry if the sequence is odd (writer active) or changed during the read. Writers flip sequence to odd on entry, even on exit.',
  },
  tags: ['concurrency', 'lock', 'seqlock', 'reader-heavy', 'lockless'],
  complexity: { time: 'O(1) read', space: 'O(1)' },
};

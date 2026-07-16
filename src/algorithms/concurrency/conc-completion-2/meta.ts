// 完成锁存器 v2（Completion Latch v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-completion-2',
  categoryId: 'concurrency',
  title: { zh: '完成锁存器 v2', en: 'Completion Latch v2' },
  summary: {
    zh: '一次性完成锁存器：count 减到 0 后所有等待者释放。',
    en: 'One-shot completion latch: waiters released when count reaches 0.',
  },
  description: {
    zh: '完成锁存器（CountDownLatch 风格）：初始化 count=N，每次 count_down 使 count−1；count=0 时所有 await 的线程被释放，且一次性（不可重置）。',
    en: 'Completion latch (CountDownLatch style): initialized with count=N; each count_down decrements; when count hits 0 all await-ers are released; one-shot (not resettable).',
  },
  tags: ['concurrency', 'synchronization', 'latch', 'completion'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};

// 读指示器（seqlock 读端）（Read Indicator (SeqLock reader)）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-read-indicator',
  categoryId: 'concurrency',
  title: { zh: '读指示器（seqlock 读端）', en: 'Read Indicator (SeqLock reader)' },
  summary: {
    zh: '读者登记在册，写者据此等待。',
    en: 'Readers register; writers wait accordingly.',
  },
  description: {
    zh: '读指示器用一个计数器记录活跃读者数，写者在进入前等待其归零，是 RCU 与 seqlock 的读端常见原语。',
    en: 'A read indicator counts active readers so a writer can wait until it drains to zero; used in RCU and seqlock readers.',
  },
  tags: ['concurrency', 'read-indicator', 'seqlock'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};

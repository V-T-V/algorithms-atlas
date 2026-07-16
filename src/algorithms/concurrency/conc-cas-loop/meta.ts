// CAS 循环（原子更新）（Compare-And-Swap Loop）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-cas-loop',
  categoryId: 'concurrency',
  title: { zh: 'CAS 循环（原子更新）', en: 'Compare-And-Swap Loop' },
  summary: {
    zh: '读-改-写循环直到 CAS 成功。',
    en: 'Read-modify-write retrying until CAS succeeds.',
  },
  description: {
    zh: 'CAS 循环反复读取当前值、计算新值，再用原子 CAS 替换；若被其它线程抢先则重试，是无锁数据结构核心原语。',
    en: 'A CAS loop reads the current value, computes a new value, and atomically CAS-replaces it, retrying on contention — the core lock-free primitive.',
  },
  tags: ['concurrency', 'cas', 'lock-free', 'atomic'],
  complexity: { time: 'O(retries)', space: 'O(1)' },
};

// 乐观锁（版本号）（Optimistic Lock (Versioned)）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-optlock',
  categoryId: 'concurrency',
  title: { zh: '乐观锁（版本号）', en: 'Optimistic Lock (Versioned)' },
  summary: { zh: '读时不锁，提交时校验版本。', en: 'No read lock; validate version at commit.' },
  description: {
    zh: '乐观锁读取时记录版本号，修改后提交前比对版本：若已变则回退重试，写冲突少时性能高。',
    en: 'Optimistic locking records the version on read and validates at commit, retrying on stale version; great with few write conflicts.',
  },
  tags: ['concurrency', 'optimistic', 'version'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

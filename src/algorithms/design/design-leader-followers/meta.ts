// 领导者-追随者（Leader-Followers）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-leader-followers',
  categoryId: 'design',
  title: { zh: '领导者-追随者', en: 'Leader-Followers' },
  summary: { zh: '领导者监听、追随者待命。', en: 'Leader listens; followers wait.' },
  description: {
    zh: '领导者-追随者模式一组线程中一个为领导者监听事件，事件到来后它晋升处理并选一个追随者当新领导者，避免锁竞争。',
    en: 'In Leader-Followers one thread of a pool is the leader listening for events; on arrival it processes and promotes a follower, reducing lock contention.',
  },
  tags: ['design', 'pattern', 'leader-followers', 'concurrency'],
  complexity: { time: 'O(t)', space: 'O(t)' },
};

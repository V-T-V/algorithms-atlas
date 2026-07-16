// 优先级队列锁（Priority Queue Lock）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-priority-queue-lock',
  categoryId: 'concurrency',
  title: { zh: '优先级队列锁', en: 'Priority Queue Lock' },
  summary: { zh: '按线程优先级授予锁。', en: 'Grants lock by thread priority.' },
  description: {
    zh: '优先级队列锁维护等待线程的优先级，释放时把锁交给最高优先级者，避免低优先级线程饿死高优先级反转。',
    en: 'A priority queue lock hands the lock to the highest-priority waiter on release, preventing priority inversion.',
  },
  tags: ['concurrency', 'priority', 'lock'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};

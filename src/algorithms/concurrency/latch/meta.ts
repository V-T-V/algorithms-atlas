// 闭锁（CountDownLatch）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'latch',
  categoryId: 'concurrency',
  title: { zh: '闭锁（CountDownLatch）', en: 'CountDownLatch' },
  summary: {
    zh: '一次性计数门：countDown 减一计数，归零前所有 await 阻塞，归零后全部放行。',
    en: 'One-shot count gate: countDown decrements; all await calls block until count hits zero, then release.',
  },
  description: {
    zh: 'CountDownLatch 是一种「一次性」同步器：初始化一个计数 count，多个线程可以调用 `countDown()` 使计数减一；调用 `await()` 的线程在计数归零前一直阻塞，归零瞬间所有等待者被一并唤醒。\n\n典型用途：「等待 N 个并行子任务全部完成」——主线程 await，每个子任务完成后 countDown。\n\n性质：\n- **一次性**：计数无法重置（与 CyclicBarrier 不同）。归零后再 countDown 计数保持 0，再 await 立即返回。\n- **不可逆**：一旦打开就不在关闭。\n\n事件序列模拟用一组 await/countDown 事件确定性推进：await 时若 count>0 则该线程进入等待集合；countDown 时 count--，若归零则唤醒全部等待者。',
    en: 'A CountDownLatch is a one-shot synchronizer: initialize with a count; threads call `countDown()` to decrement; `await()` callers block until the count reaches zero, at which point all waiters are released together.\n\nTypical use: "wait for N parallel subtasks" — the main thread awaits, each subtask countDown\'s on completion.\n\nProperties:\n- **One-shot**: the count cannot be reset (unlike CyclicBarrier). After reaching zero, further countDown keeps it at 0 and await returns immediately.\n- **Irreversible**: once open it never closes.\n\nThe event-sequence simulation deterministically processes await/countDown events: on await, if count>0 the caller enters the waiter set; on countDown, count--, and on reaching zero all waiters are released.',
  },
  tags: ['concurrency', 'latch', 'synchronizer', 'countdown'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

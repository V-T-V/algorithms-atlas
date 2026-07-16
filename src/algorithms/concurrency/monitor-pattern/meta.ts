// 管程模式（条件变量）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'monitor-pattern',
  categoryId: 'concurrency',
  title: { zh: '管程（条件变量）', en: 'Monitor (Condition Variables)' },
  summary: {
    zh: '用互斥锁 + 条件变量封装共享状态：wait 释放锁睡眠，signal 唤醒等待者。',
    en: 'Encapsulates shared state with a mutex + condition variable: wait releases the lock to sleep, signal wakes waiters.',
  },
  description: {
    zh: '管程（Monitor，C. A. R. Hoare / Per Brinch Hansen）把共享数据与操作它的过程绑定，保证一次只有一个线程在管程内（互斥）。当条件不满足时用条件变量等待：\n\n```\nlock.acquire();\nwhile (!condition)\n  cond.wait(lock);   // 原子地释放锁并睡眠；被唤醒时重新获取锁\n// 操作共享状态\ncond.signal(lock);  // 唤醒一个等待者（或 broadcast 唤醒全部）\nlock.release();\n```\n\n关键点：\n- **wait 是原子**：释放锁 + 进入睡眠不可分割，否则会丢信号\n- **while 循环检查**：被唤醒后条件可能已被别的线程抢走（Mesa 语义），必须重新检查\n- **signal/broadcast**：唤醒一个或全部等待者\n\n经典应用是「有界缓冲」：生产者在满时 wait(notFull)，消费者取后 signal(notFull)。本实现模拟条件变量的 wait/signal 序列。',
    en: 'A monitor (C. A. R. Hoare / Per Brinch Hansen) binds shared data to the procedures that operate on it, ensuring only one thread is inside at a time (mutual exclusion). A condition variable lets a thread wait when a predicate is false:\n\n```\nlock.acquire();\nwhile (!condition)\n  cond.wait(lock);   // atomically release lock and sleep; re-acquire on wake\n// operate on shared state\ncond.signal(lock);  // wake one waiter (or broadcast for all)\nlock.release();\n```\n\nKey points:\n- **Atomic wait**: releasing the lock and sleeping are inseparable, or signals are lost\n- **Loop check**: after waking the predicate may have been taken (Mesa semantics), so re-check\n- **signal/broadcast**: wake one or all waiters\n\nA canonical use is a bounded buffer: producers wait(notFull) when full, consumers signal(notFull) after taking. This implementation simulates condition-variable wait/signal sequences.',
  },
  tags: ['concurrency', 'synchronization', 'monitor', 'condition-variable'],
  complexity: { time: 'O(1) per op', space: 'O(w) for waiters' },
  attributes: { model: '步骤序列模拟 / step-sequence simulation' },
};

// 对象池模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'object-pool',
  categoryId: 'design',
  title: { zh: '对象池模式', en: 'Object Pool Pattern' },
  summary: {
    zh: '预创建一批对象循环复用：acquire 借出、release 归还，避免反复构造销毁的开销。',
    en: 'Pre-create a set of objects to reuse: acquire to borrow, release to return, avoiding repeated construction/destruction.',
  },
  description: {
    zh: '对象池（Object Pool）用于对象创建/销毁昂贵的场景（数据库连接、线程、大缓冲区）：\n\n- 启动时预分配固定数量的对象放入空闲池 free\n- **acquire()**：从 free 取一个；空则按策略阻塞/新建/拒绝\n- **release(obj)**：重置对象状态后归还 free\n- 可选：空闲超时回收、最大/最小容量、借出超时\n\n收益：\n- 消除热点路径上的分配/ GC 压力\n- 限制资源使用上限（背压）\n\n注意：归还的对象需 reset 到干净状态，避免脏数据；多线程下需同步访问 free 列表。\n\n本实现演示一个泛型对象池：固定容量，acquire 空时抛错（拒绝策略），release 归还并重置。',
    en: 'An Object Pool is used when object creation/destruction is expensive (DB connections, threads, large buffers):\n\n- At startup pre-allocate a fixed number of objects into the free pool\n- **acquire()**: take one from free; if empty, block / grow / reject per policy\n- **release(obj)**: reset its state and return it to free\n- Optional: idle eviction, min/max capacity, borrow timeout\n\nBenefits:\n- Removes allocation/GC pressure from hot paths\n- Bounds resource usage (back-pressure)\n\nCaveat: returned objects must be reset to a clean state to avoid dirty data; concurrent access to the free list needs synchronization.\n\nThis implementation shows a generic pool: fixed capacity, acquire rejects when empty, release resets and returns.',
  },
  tags: ['design', 'creational-pattern', 'resource-management', 'pool'],
  complexity: { time: 'O(1) acquire/release', space: 'O(capacity)' },
};

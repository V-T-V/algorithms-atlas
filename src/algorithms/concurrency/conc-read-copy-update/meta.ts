// RCU 读复制更新（模型）（Read-Copy-Update Model）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-read-copy-update',
  categoryId: 'concurrency',
  title: { zh: 'RCU 读复制更新（模型）', en: 'Read-Copy-Update Model' },
  summary: {
    zh: '读端无锁，写端复制后原子换指针。',
    en: 'Lock-free reads, writes swap a copied pointer.',
  },
  description: {
    zh: 'RCU(Linux 内核)读者不加锁直接访问，写者复制一份数据修改后用原子指针替换，再等所有旧读者退出后回收。',
    en: 'RCU (Linux kernel) lets readers proceed lock-free; writers copy, mutate, atomically swap the pointer, then reclaim after old readers leave.',
  },
  tags: ['concurrency', 'rcu', 'lock-free'],
  complexity: { time: 'O(1) read', space: 'O(w)' },
};

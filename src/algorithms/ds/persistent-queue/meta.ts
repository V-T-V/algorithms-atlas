// Persistent Queue · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'persistent-queue',
  categoryId: 'ds',
  title: { zh: '可持久化队列', en: 'Persistent Queue' },
  summary: {
    zh: '用持久化双栈表示队列，每次操作返回新版本、旧版本不变。',
    en: 'A queue represented by two persistent stacks; each op returns a new version, leaving old ones intact.',
  },
  description: {
    zh: '可持久化队列（Persistent Queue）：每次入队/出队都返回一个**全新的队列版本**，而所有旧版本仍可独立访问、互不影响。这种「不可变」(immutable) 结构在函数式编程、回溯、版本对比中很有用。\n\n实现采用「两个持久化栈」的经典方法：一个 front 栈（出队端）与一个 back 栈（入队端）。入队 push 到 back；出队时若 front 为空，则把 back 反转倒入 front（持久化地重建），再 pop front。每个节点通过共享不可变子结构实现 O(1) 共享、O(1) 均摊入队/出队（单次倾倒 O(k) 但均摊到 k 次入队）。空间 O(n) 总节点数。',
    en: 'A Persistent Queue returns a brand-new queue version on every enqueue/dequeue, while all prior versions remain accessible and untouched. Such immutable structures are valuable in functional programming, backtracking, and version comparison.\n\nImplementation uses the classic "two persistent stacks" method: a front stack (dequeue end) and a back stack (enqueue end). Enqueue pushes onto back; on dequeue, if front is empty we reverse back into front (rebuild persistently), then pop front. Nodes share immutable substructure for O(1) sharing and O(1) amortised enqueue/dequeue (a single dump is O(k) but amortises over k enqueues). Total space O(n) nodes.',
  },
  tags: ['ds', 'queue', 'persistent', 'immutable', 'functional'],
  complexity: { time: 'O(1) 均摊', space: 'O(n)' },
  attributes: { immutable: 'true', persistent: 'true' },
};

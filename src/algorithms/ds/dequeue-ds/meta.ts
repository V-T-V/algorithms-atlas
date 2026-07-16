// Deque (Array-based) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dequeue-ds',
  categoryId: 'ds',
  title: { zh: '双端队列（动态数组）', en: 'Deque (Dynamic Array)' },
  summary: {
    zh: '基于动态数组 + 双指针（head/tail）的双端队列，两端均 O(1)。',
    en: 'A dynamic-array deque with head/tail pointers giving O(1) at both ends.',
  },
  description: {
    zh: '双端队列（Deque，Double-Ended Queue）允许在队首和队尾两端进行入队、出队操作。本实现采用**动态数组 + 循环缓冲**：维护一个固定容量的底层数组，用 head、tail 两个指针分别指向队首与下一个写入位置，下标取模实现环形。入队写入对应端并移动指针，出队读取后移动指针。\n\n当容量不足时按 2 倍扩容并搬移元素。每端入队 / 出队均摊 O(1)，随机访问 O(1)。本实现与 ds/deque（同样环形缓冲）的区别在于配套更完整的「扩容、随机访问、容量查询」API 与更完整的钩子，便于演示双端语义。',
    en: "A Deque (Double-Ended Queue) supports enqueue and dequeue at both the front and the back. This implementation uses a **dynamic array + circular buffer**: a fixed-capacity underlying array with head and tail pointers (indices taken mod capacity for the ring). Enqueue writes to the chosen end and moves the pointer; dequeue reads and moves the pointer.\n\nOn overflow it doubles capacity and reflows elements. Each end's enqueue/dequeue is amortised O(1); random access is O(1). Compared with ds/deque (also a ring buffer), this version ships a more complete API (grow, random access, capacity query) and richer hooks for visualising two-ended semantics.",
  },
  tags: ['ds', 'deque', 'queue', 'circular-buffer', 'dynamic-array'],
  complexity: { time: 'O(1) 均摊', space: 'O(n)' },
};

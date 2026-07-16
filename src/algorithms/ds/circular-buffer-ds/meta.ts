// Circular Buffer · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'circular-buffer-ds',
  categoryId: 'ds',
  title: { zh: '循环缓冲区', en: 'Circular Buffer' },
  summary: {
    zh: '固定容量的环形缓冲：读写指针取模回绕，生产者/消费者语义。',
    en: 'A fixed-capacity ring buffer: read/write pointers wrap mod capacity, producer/consumer semantics.',
  },
  description: {
    zh: '循环缓冲区（Circular Buffer / Ring Buffer）用一块固定大小的数组作存储，维护 write（写指针）与 read（读指针），下标对容量取模实现「首尾相连」的环形。写入时数据落到 write 处并前移，读取时从 read 处取并前移。\n\n关键约束是「容量固定」：缓冲满时写入或抛错、或覆盖最旧数据（覆盖模式）；缓冲空时读取返回失败。本实现提供两种写入模式（阻塞式 / 覆盖式），并维护已用计数避免「满与空」的二义性。读写均 O(1)，空间 O(capacity)。广泛用于流式数据、生产者-消费者、IO 缓冲。',
    en: 'A Circular Buffer (Ring Buffer) uses a fixed-size array as storage with a write pointer and a read pointer; indices are taken mod capacity to form a ring. Writes land at write and advance it; reads take from read and advance it.\n\nThe key constraint is "fixed capacity": on full, a write either errors or overwrites the oldest data (overwrite mode); on empty, a read fails. This implementation supports both write modes (blocking / overwrite) and maintains a used-count to disambiguate "full" from "empty". Read/write are O(1), space O(capacity). Widely used for streaming data, producer-consumer queues, and IO buffering.',
  },
  tags: ['ds', 'ring-buffer', 'circular-buffer', 'fixed-capacity', 'producer-consumer'],
  complexity: { time: 'O(1)', space: 'O(capacity)' },
};

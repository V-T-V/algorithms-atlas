// 睡眠理发师（Sleeping Barber）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'barber-sleeping',
  categoryId: 'concurrency',
  title: { zh: '睡眠理发师', en: 'Sleeping Barber' },
  summary: {
    zh: '理发师无客时睡觉，顾客到则唤醒；等待椅满则顾客离去。',
    en: 'Barber sleeps when idle, woken on arrival; customers leave if waiting chairs are full.',
  },
  description: {
    zh: '睡眠理发师问题（Dijkstra 1965）：理发店有一名理发师、N 把等待椅、一把理发椅。理发师没有顾客时睡觉；顾客到来时：\n- 若理发师在睡，唤醒他；\n- 若有空等待椅，坐下等候；\n- 若等待椅满，立即离开（丢失顾客）。\n\n经典信号量解法：\n- `customers` 信号量计数等待的顾客；\n- `barbers` 信号量计数空闲的理发师（0 或 1）；\n- 互斥锁保护等待椅计数；\n- 理发师循环 `wait(customers)`（无客则睡），顾客 `signal(customers)` 后 `wait(barbers)` 落座理发。\n\n事件序列模拟：输入顾客到达序列（每个含到达时刻与是否接受等待），按 N 把椅子容量推进，统计服务数、丢弃数、理发师忙/闲/睡状态。',
    en: "The Sleeping Barber problem (Dijkstra, 1965): a barbershop has one barber, N waiting chairs, and one barber chair. The barber sleeps when no customer is present. On arrival a customer:\n- wakes the barber if he is asleep;\n- sits in a waiting chair if one is free;\n- leaves immediately (lost customer) if all chairs are full.\n\nClassic semaphore solution:\n- `customers` semaphore counts waiting customers;\n- `barbers` semaphore counts idle barbers (0 or 1);\n- a mutex guards the waiting-chair count;\n- the barber loops `wait(customers)` (sleeps if none); a customer `signal(customers)` then `wait(barbers)` to get a haircut.\n\nThe event-sequence simulation takes an arrival sequence and advances under capacity N, tracking served count, lost count, and the barber's busy/idle/asleep state.",
  },
  tags: ['concurrency', 'synchronization', 'classic', 'bounded-buffer'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

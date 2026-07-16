// 理发师问题（完整）（Sleeping Barber (Full)）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-sleeping-barber-full',
  categoryId: 'concurrency',
  title: { zh: '理发师问题（完整）', en: 'Sleeping Barber (Full)' },
  summary: { zh: '顾客/理发师/椅三信号量。', en: 'Customer/barber/chair three semaphores.' },
  description: {
    zh: '睡眠理发师用 customers/barbers/mutex 三信号量协调:顾客满座则离开，理发师无客则睡，有客则唤醒理发。',
    en: 'Sleeping barber uses customers/barbers/mutex semaphores: customers leave if full, barber sleeps when idle, wakes to cut.',
  },
  tags: ['concurrency', 'sleeping-barber', 'semaphore'],
  complexity: { time: 'O(1) per op', space: 'O(chairs)' },
};

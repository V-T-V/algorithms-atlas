// Tanenbaum 哲学家问题 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-philosophers-tanenbaum',
  categoryId: 'concurrency',
  title: { zh: 'Tanenbaum 哲学家问题', en: 'Tanenbaum Dining Philosophers' },
  summary: {
    zh: '状态机版：THINKING/HUNGRY/EATING，邻接非进餐时才转 EATING，避免死锁。',
    en: 'State-machine variant: THINKING/HUNGRY/EATING; turn EATING only if neighbors are not eating.',
  },
  description: {
    zh: 'Tanenbaum 教材给出的解决方案用三态数组 state[i]：\n\n- take_forks(i)：state[i]=HUNGRY；test(i)；\n- test(i)：若 state[i]=HUNGRY 且左右邻居都非 EATING，则 state[i]=EATING 并 signal。\n- put_forks(i)：state[i]=THINKING；test(左)；test(右)。\n\n用信号量数组保证：拿不到两叉则阻塞。本实现用确定性事件序列推进，展示状态转移。',
    en: "Tanenbaum's textbook solution uses a state array state[i] with three states:\n\n- take_forks(i): state[i]=HUNGRY; test(i)\n- test(i): if state[i]=HUNGRY and both neighbors are not EATING, set state[i]=EATING and signal\n- put_forks(i): state[i]=THINKING; test(left); test(right)\n\nA semaphore array blocks a philosopher who cannot get both forks. This implementation drives a deterministic event sequence showing the state transitions.",
  },
  tags: ['concurrency', 'dining-philosophers', 'state-machine'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

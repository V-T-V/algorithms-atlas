// 野蛮人就餐 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-dining-savages',
  categoryId: 'concurrency',
  title: { zh: '野蛮人就餐问题', en: 'Dining Savages Problem' },
  summary: {
    zh: '厨师填满锅，野蛮人轮流取食；锅空时唤醒厨师并等待。',
    en: 'Cook refills the pot; savages take turns eating; an empty pot wakes the cook and waits.',
  },
  description: {
    zh: 'Tanenbaum 提出的同步问题：部落有 N 个野蛮人共享一锅容量 M 的食物。野蛮人想吃饭时取一份；若锅空，则唤醒厨师、等待厨师做好填满后再取。厨师一次做满 M 份。',
    en: 'A synchronization problem from Tanenbaum: N savages share a pot of capacity M servings. A hungry savage takes one serving; if the pot is empty it wakes the cook, waits for a refill, then eats. The cook refills all M servings at once.',
  },
  tags: ['concurrency', 'synchronization', 'dining-savages'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

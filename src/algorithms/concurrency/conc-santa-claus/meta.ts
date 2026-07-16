// 圣诞老人问题 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-santa-claus',
  categoryId: 'concurrency',
  title: { zh: '圣诞老人问题', en: 'Santa Claus Problem' },
  summary: {
    zh: 'Santa 被 3 只驯鹿或 9 只精灵唤醒：驯鹿优先，组装礼物或派发。',
    en: 'Santa is woken by either 9 reindeer or 3 elves; reindeer take priority to deliver toys or help elves.',
  },
  description: {
    zh: 'Tanenbaum 经典问题：圣诞老人在睡觉。9 只驯鹿全部回来（或 3 只精灵遇到麻烦）时唤醒他。若两者都满足，驯鹿优先。Santa 给驯鹿派发礼物，给精灵提供帮助。',
    en: "Tanenbaum's classic: Santa sleeps until either all 9 reindeer return or 3 elves have a problem. If both, reindeer take priority. Santa delivers toys with the reindeer or helps the elves.",
  },
  tags: ['concurrency', 'synchronization', 'santa-claus'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

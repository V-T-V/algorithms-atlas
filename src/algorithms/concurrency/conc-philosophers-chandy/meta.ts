// Chandy 哲学家解法（Chandy/Misra Dining Philosophers）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-philosophers-chandy',
  categoryId: 'concurrency',
  title: { zh: 'Chandy 哲学家解法', en: 'Chandy/Misra Dining Philosophers' },
  summary: { zh: '叉子为令牌按洁净度流转。', en: 'Forks as tokens flow by cleanliness.' },
  description: {
    zh: 'Chandy/Misra 解法允许任意两哲学家争用一把叉子：叉子有脏/洁状态，请求时脏叉转交并清洗，保证无死锁与公平。',
    en: 'Chandy/Misra lets forks be shared: dirty forks are handed over and cleaned on request, deadlock-free and fair.',
  },
  tags: ['concurrency', 'dining-philosophers', 'distributed'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

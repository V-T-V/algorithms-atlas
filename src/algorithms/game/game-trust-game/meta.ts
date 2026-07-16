// 信任博弈（Trust Game）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-trust-game',
  categoryId: 'game',
  title: { zh: '信任博弈', en: 'Trust Game' },
  summary: {
    zh: '委托人送钱给受托人，金额翻倍后受托人返还，衡量信任与可信。',
    en: 'Sender gives money to trustee, multiplied then partially returned; measures trust and trustworthiness.',
  },
  description: {
    zh: '信任博弈：委托人持 e，送 s∈[0,e]，受托人收到 m·s，返还 r∈[0,m·s]。子博弈完美：受托人返还 0，委托人送 0；实验中常 s,r>0。',
    en: 'Trust game: sender endowment e sends s∈[0,e]; trustee receives m·s, returns r. SPNE: trustee returns 0, sender sends 0; experiments show s,r>0.',
  },
  tags: ['game', 'behavioral', 'economics'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

// 鹰鸽博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-hawk-dove-2',
  categoryId: 'game',
  title: { zh: '鹰鸽博弈', en: 'Hawk-Dove' },
  summary: {
    zh: '资源 V、受伤代价 C：鹰斗鸽得资源、双鹰互伤；演化稳定策略经典模型。',
    en: 'Resource V, injury cost C: hawks beat doves, two hawks fight; canonical ESS model.',
  },
  description: {
    zh: '鹰鸽博弈（演化博弈）。行/列选 H(鹰) 或 D(鸽)。V=4, C=6。\n      H      D\n  H -1,-1   4,0\n  D  0,4    2,2\n两个纯纳什：(H,D) 与 (D,H)；混合均衡频率 H*=V/C。',
    en: 'Hawk-Dove (evolutionary). Actions H or D. V=4, C=6.\n      H      D\n  H -1,-1   4,0\n  D  0,4    2,2\nTwo pure Nash: (H,D) and (D,H); mixed ESS freq H*=V/C.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

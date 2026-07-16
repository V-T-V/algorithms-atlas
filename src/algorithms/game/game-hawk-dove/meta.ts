// 鹰鸽博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-hawk-dove',
  categoryId: 'game',
  title: { zh: '鹰鸽博弈', en: 'Hawk-Dove Game' },
  summary: {
    zh: '动物争资源：鹰斗、鸽退。两个不对称纯纳什，混合策略给出进化稳定比例。',
    en: 'Animals contest a resource: hawks fight, doves retreat. Two asymmetric pure Nash; the mixed strategy yields the ESS frequency.',
  },
  description: {
    zh: '资源价值 V，受伤代价 C。鹰遇鹰各 (V−C)/2，鹰遇鸽鹰得 V 鸽得 0，鸽遇鸽各 V/2。求 ESS 混合概率。',
    en: 'Resource value V, injury cost C. Hawk-Hawk: (V−C)/2 each; Hawk-Dove: V/0; Dove-Dove: V/2 each. Find the ESS mixed frequency.',
  },
  tags: ['game', 'game-theory', 'evolutionary'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};

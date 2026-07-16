// 找第二大元素（锦标赛 + 冠军对手法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'second-largest',
  categoryId: 'selection',
  title: { zh: '找第二大元素', en: 'Find the Second Largest' },
  summary: {
    zh: '锦标赛找最大后，次大必在败给冠军的 ⌈log₂n⌉ 个对手中。',
    en: "After a tournament for the max, the second largest is among the champion's ⌈log₂n⌉ losers.",
  },
  description: {
    zh: '找第二大元素的高效方法：先跑一次锦标赛（n−1 次比较）找出冠军（最大），并记录每个元素击败过的对手；由于第二大元素只可能在某轮输给冠军，因此它一定在冠军的「败者名单」里（共 ⌈log₂n⌉ 个）。再对这 ⌈log₂n⌉ 个元素扫一遍取最大即可（⌈log₂n⌉−1 次比较）。\n\n- 总比较次数：n + ⌈log₂n⌉ − 2\n- 这是找第二大元素的比较次数最优解',
    en: "Run a tournament (n−1 comparisons) to find the champion (max), recording each element's defeated opponents. The second largest must have lost only to the champion, so it lies among the champion's ⌈log₂n⌉ losers. Scan those for the max (⌈log₂n⌉−1 comparisons). Total: n + ⌈log₂n⌉ − 2 comparisons — optimal.",
  },
  tags: ['selection', 'second-largest', 'tournament', 'comparison-model'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

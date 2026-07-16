import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-superwash-3',
  categoryId: 'dp',
  title: { zh: '超级洗衣机', en: 'Super Washing Machines' },
  summary: {
    zh: 'n 台洗衣机，每台可向相邻移动 1 件衣服，求使所有台数相等的最少步数。',
    en: 'Each move shifts 1 dress to neighbor; min moves to equalize all machines.',
  },
  description: {
    zh: '设总 dress 为 S，target=S/n。对每台算 gain[i]=sum(dress[0..i])-target*(i+1)，答案=max(|gain[i]|, max 一次穿过)。',
    en: 'target=S/n. gain[i]=prefix sum - target*(i+1). Answer=max(|gain[i]|).',
  },
  tags: ['dp', 'greedy', 'prefix-sum'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};

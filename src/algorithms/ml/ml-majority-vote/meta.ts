// 多数投票集成 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-majority-vote',
  categoryId: 'ml',
  title: { zh: '多数投票集成', en: 'Majority Voting Ensemble' },
  summary: { zh: '分类预测按多数投票集成。', en: 'Ensemble classifier via majority voting.' },
  description: {
    zh: '对每个样本取所有模型预测中出现次数最多的类别。',
    en: 'For each sample, pick the most frequent class across models.',
  },
  tags: ['ml', 'ensemble'],
  complexity: { time: 'O(mn)', space: 'O(k)' },
};

// 手段-目的分析（Means-End Analysis）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-means-end-analysis',
  categoryId: 'ai-search',
  title: { zh: '手段-目的分析', en: 'Means-End Analysis' },
  summary: {
    zh: 'GPS 经典：比较当前与目标选算子。',
    en: 'GPS classic: choose operators to reduce difference.',
  },
  description: {
    zh: '手段-目的分析(Newell & Simon 的 GPS)比较当前状态与目标差异，选择能减小差异的算子并递归消除子差异。',
    en: 'Means-end analysis (Newell & Simon GPS) compares current and goal states, picks operators reducing the difference, recursing on sub-differences.',
  },
  tags: ['ai-search', 'means-end', 'gps', 'planning'],
  complexity: { time: 'O(o * d)', space: 'O(d)' },
};

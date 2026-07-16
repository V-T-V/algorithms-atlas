// 最大不冲突预约集 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-conflicting-appts',
  categoryId: 'backtracking',
  title: { zh: '最大不冲突预约集', en: 'Max Non-conflicting Appointments' },
  summary: {
    zh: '回溯选最多互不时间冲突的预约。',
    en: 'Backtrack to pick max non-overlapping appointments.',
  },
  description: { zh: '按结束排序，回溯选/不选。', en: 'Sort by end, pick/skip. O(2^n).' },
  tags: ['backtracking', 'interval'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};

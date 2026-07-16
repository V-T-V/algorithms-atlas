// 优先级反馈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-priority-feedback',
  categoryId: 'scheduling',
  title: { zh: '优先级反馈', en: 'Priority Feedback' },
  summary: {
    zh: '运行后降低优先级，防止独占。',
    en: 'Demote priority after running, prevent monopoly.',
  },
  description: { zh: '每跑一拍优先级+1（变低）。', en: 'Each tick pri += 1. O(n*total).' },
  tags: ['scheduling', 'feedback'],
  complexity: { time: 'O(n*total)', space: 'O(n)' },
};

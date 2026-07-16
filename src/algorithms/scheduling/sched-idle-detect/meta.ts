// 空闲时间检测 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-idle-detect',
  categoryId: 'scheduling',
  title: { zh: '空闲时间检测', en: 'Idle Time Detection' },
  summary: {
    zh: '从甘特段中找出所有 CPU 空闲区间。',
    en: 'Find all CPU idle intervals from Gantt segments.',
  },
  description: { zh: '排序段，找间隙。', en: 'Sort segments, find gaps. O(n log n).' },
  tags: ['scheduling', 'metric'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

// 甘特图构建 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-gantt',
  categoryId: 'scheduling',
  title: { zh: '甘特图构建', en: 'Gantt Chart Builder' },
  summary: { zh: '从段列表构建文本甘特图。', en: 'Build text Gantt chart from segments.' },
  description: { zh: '按时间展开为时间轴。', en: 'Expand to timeline. O(total).' },
  tags: ['scheduling', 'gantt'],
  complexity: { time: 'O(total)', space: 'O(total)' },
};

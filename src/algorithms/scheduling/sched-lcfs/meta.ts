// 后到先服务 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-lcfs',
  categoryId: 'scheduling',
  title: { zh: '后到先服务', en: 'Last Come First Served' },
  summary: { zh: '后到达的进程先执行（栈式）。', en: 'Last-arrived process runs first (stack).' },
  description: { zh: '用栈，弹出栈顶。', en: 'Stack pop. O(n).' },
  tags: ['scheduling', 'lcfs'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

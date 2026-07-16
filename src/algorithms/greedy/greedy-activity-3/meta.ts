// 活动选择（带名称） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-activity-3',
  categoryId: 'greedy',
  title: { zh: '活动选择（带名称）', en: 'Activity Selection' },
  summary: {
    zh: '经典活动选择：n 个活动带起止时间，选最多可执行的活动。',
    en: 'Classic activity selection: n activities with start/end times; pick the maximum feasible subset.',
  },
  description: {
    zh: '活动选择问题（与区间调度同构）：按活动结束时间升序，能选就选。本实现带活动名称便于追踪。',
    en: 'Activity selection (isomorphic to interval scheduling): sort by end time, accept whenever feasible. Includes activity names.',
  },
  tags: ['greedy', 'interval'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};

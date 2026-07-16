// 视频拼接 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-video-stitching',
  categoryId: 'greedy',
  title: { zh: '视频拼接', en: 'Video Stitching' },
  summary: {
    zh: '用若干片段拼接覆盖 [0,T]，求最少片段数。',
    en: 'Stitch clips to cover [0,T]; find the minimum number of clips.',
  },
  description: {
    zh: '贪心跳跃：在当前覆盖范围内选能延伸最远的下一段。',
    en: 'Greedy jump: within current coverage pick the clip extending farthest.',
  },
  tags: ['greedy', 'jump-game', 'interval'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};

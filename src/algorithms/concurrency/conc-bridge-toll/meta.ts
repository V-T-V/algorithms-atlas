// 桥梁通行 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-bridge-toll',
  categoryId: 'concurrency',
  title: { zh: '桥梁通行问题', en: 'Bridge Toll Problem' },
  summary: {
    zh: '窄桥单向通行：同向可多车，反向须等待，公平切换方向。',
    en: 'A narrow one-way bridge: same-direction traffic may share; opposing traffic waits; direction switches fairly.',
  },
  description: {
    zh: '窄桥同一时刻只允许一个方向通行，同向车辆可连续通过（最多 N 辆）以防另一方向饿死。状态：当前方向、桥上车辆数、等待计数。',
    en: 'A narrow bridge allows only one direction at a time; same-direction cars may pass consecutively (capped at N) to avoid starving the other side. State: current direction, on-bridge count, waiting counts.',
  },
  tags: ['concurrency', 'synchronization', 'resource-sharing'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

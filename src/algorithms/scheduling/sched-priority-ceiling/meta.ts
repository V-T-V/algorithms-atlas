// 优先级天花板协议 (Priority Ceiling) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-priority-ceiling',
  categoryId: 'scheduling',
  title: { zh: '优先级天花板协议 (PCP)', en: 'Priority Ceiling Protocol (PCP)' },
  summary: {
    zh: '每资源预设天花板（所有可能用者的最高优先级），持有时立即升至此优先级，杜绝死锁与反转。',
    en: 'Each resource has a precomputed ceiling (highest priority of all potential users); a holder is instantly raised to it, preventing deadlock and inversion.',
  },
  description: {
    zh: '优先级天花板协议（Priority Ceiling Protocol, PCP）及其即时版本（Immediate Ceiling Priority Protocol, ICPP）是实时系统中比 PIP 更强的资源访问协议。每个资源 R 预先计算天花板 ceiling(R) = 所有可能使用 R 的任务中最高优先级。任一任务获得 R 后立即把自身优先级提升到 ceiling(R)（ICPP），或在尝试获取可能造成阻塞的资源时由系统检查（OCPP）。这样既防止优先级反转，又防止死锁。本实现采用 ICPP 语义。',
    en: 'The Priority Ceiling Protocol (PCP) and its immediate variant (Immediate Ceiling Priority Protocol, ICPP) are stronger resource-access protocols than PIP for real-time systems. Each resource R has a precomputed ceiling(R) = the highest priority among all tasks that may use R. Any task acquiring R is instantly raised to ceiling(R) (ICPP), or the system checks on lock attempts (OCPP). This both prevents priority inversion and avoids deadlock. This implementation uses the ICPP semantics.',
  },
  tags: ['scheduling', 'priority-ceiling', 'icpp', 'real-time', 'deadlock'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

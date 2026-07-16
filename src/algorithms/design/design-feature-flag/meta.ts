// 特性开关（Feature Flag）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-feature-flag',
  categoryId: 'design',
  title: { zh: '特性开关', en: 'Feature Flag' },
  summary: {
    zh: '特性开关：运行时切换功能启停，灰度发布。',
    en: 'Feature flag: toggle features at runtime for incremental rollout.',
  },
  description: {
    zh: '特性开关（Feature Flag）用 key→boolean 控制功能是否启用，支持百分比灰度（hash 用户 id 取模）与 A/B 测试。',
    en: 'Feature Flag uses key→boolean to toggle features, supporting percentage rollouts (hash user id modulo) and A/B testing.',
  },
  tags: ['design', 'feature-flag', 'rollout', 'ab-test'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};

// 拦截器（Interceptor）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-interceptor',
  categoryId: 'design',
  title: { zh: '拦截器', en: 'Interceptor' },
  summary: {
    zh: '拦截器：在调用前后插入横切逻辑。',
    en: 'Interceptor: insert cross-cutting logic before/after a call.',
  },
  description: {
    zh: '拦截器（Interceptor）在目标调用前后注入预处理与后处理逻辑（日志、鉴权、度量），不修改目标代码。',
    en: 'Interceptor injects pre/post logic (logging, auth, metrics) around a target call without modifying the target.',
  },
  tags: ['design', 'interceptor', 'aop', 'cross-cutting'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};

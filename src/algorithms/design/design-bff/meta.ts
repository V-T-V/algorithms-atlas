// BFF（Backend For Frontend）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-bff',
  categoryId: 'design',
  title: { zh: 'BFF', en: 'Backend For Frontend' },
  summary: {
    zh: 'BFF：为前端定制的聚合层。',
    en: 'BFF: an aggregation layer tailored for a specific frontend.',
  },
  description: {
    zh: 'BFF（Backend For Frontend）为每个前端（Web/Mobile）定制一个后端，聚合多个微服务的数据并裁剪为前端所需形状，减少前端往返。',
    en: 'BFF (Backend For Frontend) provides a dedicated backend per frontend (Web/Mobile), aggregating multiple microservices and shaping data for that frontend, reducing client round-trips.',
  },
  tags: ['design', 'bff', 'aggregation', 'gateway'],
  complexity: { time: 'O(s)', space: 'O(1)' },
};

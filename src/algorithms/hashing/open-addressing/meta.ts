// Open Addressing Hash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'open-addressing',
  categoryId: 'hashing',
  title: { zh: '开放寻址哈希', en: 'Open Addressing Hash' },
  summary: {
    zh: '开放寻址哈希属于hashing类别。',
    en: 'Open Addressing Hash is a hashing algorithm.',
  },
  description: {
    zh: '开放寻址哈希（Open Addressing Hash）属于hashing类别的算法。',
    en: 'Open Addressing Hash is an algorithm in the hashing category.',
  },
  tags: ["hashing"],
  complexity: { time: 'O(1) 期望 / O(n) 最坏', space: 'O(n)' },
};

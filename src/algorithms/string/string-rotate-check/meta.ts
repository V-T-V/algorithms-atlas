// 字符串旋转判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-rotate-check',
  categoryId: 'string',
  title: { zh: '字符串旋转判定（s2 是否 s1 旋转）', en: 'String Rotation Check' },
  summary: {
    zh: '判定 s2 是否为 s1 的循环旋转：s1+s1 中是否包含 s2。',
    en: 'Check whether s2 is a cyclic rotation of s1: whether s1+s1 contains s2.',
  },
  description: {
    zh: '经典判定：s2 是 s1 的某次循环旋转当且仅当 len 相等且 s2 是 (s1+s1) 的子串。本实现用 KMP 在 O(n) 内完成子串包含判定；并提供枚举所有旋转位置的接口。零 DOM 依赖。',
    en: 'Classic test: s2 is a cyclic rotation of s1 iff lengths are equal and s2 is a substring of (s1+s1). This uses KMP for O(n) substring containment and also enumerates all rotation offsets. Zero DOM dependency.',
  },
  tags: ['string', 'rotation', 'kmp', 'substring'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

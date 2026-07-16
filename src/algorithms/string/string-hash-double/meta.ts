// 双哈希（类封装）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-hash-double',
  categoryId: 'string',
  title: { zh: '双哈希（类封装前缀哈希）', en: 'Double Hash (Class-based Prefix Hash)' },
  summary: {
    zh: '用两对独立基数与模数构造前缀哈希，O(1) 查询任意子串哈希。',
    en: 'Build prefix hashes with two independent base/mod pairs; query any substring hash in O(1).',
  },
  description: {
    zh: '滚动哈希单模数存在碰撞风险，双哈希用两对独立参数 (b1,m1) 与 (b2,m2) 同时计算，将碰撞概率降到约 1/(m1·m2)。本实现用类封装：预计算前缀哈希与幂表，支持 O(1) 查询任意子串 [l,r) 的双哈希值。区别于已有的 double-hash（函数式），本算法以类形式提供前缀哈希与子串查询，便于多次比较。',
    en: 'A single-modulus rolling hash risks collisions; double hashing uses two independent (base, mod) pairs to drive the collision probability down to about 1/(m1·m2). This class-based implementation precomputes prefix hashes and power tables, supporting O(1) substring [l,r) hash queries. Distinct from the existing double-hash (functional), this exposes prefix hashing and substring queries as a class for repeated comparisons.',
  },
  tags: ['string', 'hash', 'rolling-hash', 'double-hash'],
  complexity: { time: 'O(n) 预处理 / O(1) 查询', space: 'O(n)' },
};

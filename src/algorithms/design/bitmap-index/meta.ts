// 位图索引 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitmap-index',
  categoryId: 'design',
  title: { zh: '位图索引', en: 'Bitmap Index' },
  summary: {
    zh: '用比特位标记元素存在性，O(1) 查询、内存极省。',
    en: 'Mark element presence with bits for O(1) lookup and tiny memory footprint.',
  },
  description: {
    zh: '位图索引用一串二进制位记录「某个值是否存在」：值 v 存在则第 v 位置 1，否则 0。每个整数仅占 1 bit，对值域不大（如 0..10⁶）的集合极其省内存。\n\n- 支持 add / has / remove / clear\n- 集合运算（交并补）可用按位与/或/异或并行加速\n- 是数据库、布隆过滤器、OS 页面分配等的基础组件\n\n时间 O(1)/操作，空间 O(V/8) 字节。',
    en: 'A bitmap index uses a string of bits to record "does value v exist": set bit v to 1 if present, else 0. Each integer costs only 1 bit, so for small value ranges (e.g. 0..10⁶) it is extremely memory-frugal.\n\n- Supports add / has / remove / clear\n- Set ops (and/or/xor) parallelize via bitwise instructions\n- A building block of databases, Bloom filters, OS page allocators\n\nTime O(1) per op, space O(V/8) bytes.',
  },
  tags: ['bit-manipulation', 'index', 'design-paradigm'],
  complexity: { time: 'O(1)', space: 'O(V/8) 字节' },
};

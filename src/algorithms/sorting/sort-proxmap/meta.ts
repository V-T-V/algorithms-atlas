// 近邻映射排序（Proxmap） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-proxmap',
  categoryId: 'sorting',
  title: { zh: '近邻映射排序（Proxmap）', en: 'Proxmap Sort' },
  summary: {
    zh: '按值线性映射到「近邻桶」，桶内插入排序后即得全局有序。',
    en: 'Map values linearly to proxmap buckets, insertion-sort within, then collect globally sorted.',
  },
  description: {
    zh: '近邻映射排序（Proxmap Sort, Proximity Map）类似桶排序：用线性函数把每个值映射到一个桶下标 hitIdx = floor((v-min)/(max-min+1)*n)，桶内用插入排序维护有序。映射函数让相邻值尽量落同桶或相邻桶，扫描一遍桶即得全局有序。对均匀分布近似 O(n)。空间 O(n)，稳定。',
    en: 'Proxmap sort (proximity map) resembles bucket sort: a linear function maps each value to a bucket index hitIdx = floor((v-min)/(max-min+1)*n), and each bucket is kept ordered by insertion sort. The mapping sends neighboring values to the same or adjacent buckets, so a single sweep of the buckets yields global order. Near O(n) on uniform input. Space O(n), stable.',
  },
  tags: ['sorting', 'distribution', 'stable', 'hash'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};

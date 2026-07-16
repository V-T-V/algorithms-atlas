// Binary Indexed Tree (with range update) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'binary-indexed-tree-impl',
  categoryId: 'ds',
  title: { zh: '树状数组（区间更新版）', en: 'Binary Indexed Tree (Range Update)' },
  summary: {
    zh: '用两个 BIT 实现区间加 + 区间和查询，O(log n) 双操作。',
    en: 'Two BITs implement range-add plus range-sum query, both in O(log n).',
  },
  description: {
    zh: '本实现是树状数组（Fenwick Tree / BIT）的「区间更新 + 区区间查询」增强版。经典 BIT 只支持单点修改 + 前缀查询；要做「对区间 [l,r] 整体加 v」+「查询区间 [l,r] 的和」需借助差分思想：\n\n维护两个 BIT：B1 维护差分数组 d[i]，B2 维护 i·d[i]。则前缀和 S(x) = sum(d[1..x])·(x+1) - sum(i·d[1..x]) = query(B1,x)·(x+1) - query(B2,x)。区间加 [l,r] 转化为 d[l]+=v, d[r+1]-=v（在 B1、B2 上各做两次单点更新）。\n\n所有操作 O(log n)，空间 O(n)。1-based。本实现与 ds/fenwick-tree（单点版）互补。',
    en: 'This implementation is the "range update + range query" upgrade of the Fenwick Tree (BIT). The classic BIT only supports point updates and prefix queries; supporting "add v to [l,r]" plus "sum over [l,r]" needs a difference-array trick:\n\nMaintain two BITs: B1 holds the difference array d[i], B2 holds i·d[i]. Then the prefix sum S(x) = sum(d[1..x])·(x+1) - sum(i·d[1..x]) = query(B1,x)·(x+1) - query(B2,x). A range add on [l,r] becomes d[l]+=v, d[r+1]-=v (two point updates on each of B1 and B2).\n\nAll operations are O(log n), space O(n), 1-based. This complements ds/fenwick-tree (point-update version).',
  },
  tags: ['ds', 'bit', 'fenwick', 'range-update', 'prefix-sum'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};

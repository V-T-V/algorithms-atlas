import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UnionFindRank,
  unionFindRank,
  type UFRankOps,
} from '../../src/algorithms/ds/union-find-rank/impl.ts';

const OPS: UFRankOps = {
  size: 8,
  unions: [
    [0, 1],
    [2, 3],
    [4, 5],
    [0, 2],
    [6, 7],
    [4, 6],
    [0, 4],
  ],
};

test('unionFindRank 基本连通性', () => {
  const uf = unionFindRank(OPS);
  assert.ok(uf.connected(0, 7));
  assert.ok(uf.connected(3, 6));
  assert.ok(uf.connected(1, 5));
});

test('unionFindRank 分量计数', () => {
  const uf = new UnionFindRank(4);
  assert.equal(uf.components(), 4);
  uf.union(0, 1);
  uf.union(2, 3);
  assert.equal(uf.components(), 2);
  uf.union(0, 2);
  assert.equal(uf.components(), 1);
});

test('unionFindRank 同根合并返回 false', () => {
  const uf = new UnionFindRank(3);
  assert.equal(uf.union(0, 1), true);
  assert.equal(uf.union(0, 1), false);
  uf.union(1, 2);
  assert.equal(uf.union(0, 2), false);
});

test('unionFindRank 等高合并使 rank+1', () => {
  const uf = new UnionFindRank(4);
  uf.union(0, 1); // rank[0] -> 1
  assert.equal(uf.rankOf(uf.find(0)), 1);
  uf.union(2, 3); // rank[2] -> 1
  uf.union(0, 2); // 两棵等高 rank1 合并 -> rank+1
  assert.equal(uf.rankOf(uf.find(0)), 2);
});

test('unionFindRank 不等高合并不增加 rank', () => {
  const uf = new UnionFindRank(4);
  uf.union(0, 1); // rank[0]=1
  uf.union(2, 3); // rank[2]=1
  uf.union(0, 2); // rank[0]=2
  // 现在根 rank=2。再 union 一个 rank0 的单元素：不应增加
  const uf2 = new UnionFindRank(5);
  uf2.union(0, 1);
  uf2.union(0, 2); // 0(rank1) ⋃ 2(rank0) → rank 仍 1
  assert.equal(uf2.rankOf(uf2.find(0)), 1);
});

test('unionFindRank 单元素 / 空', () => {
  const uf = new UnionFindRank(1);
  assert.equal(uf.find(0), 0);
  assert.equal(uf.components(), 1);
  assert.equal(uf.rankOf(0), 0);
});

test('unionFindRank 树高被约束在 O(log n)', () => {
  // 链式 union 不带压缩：按秩保证高 ≤ ⌈log2 n⌉
  const n = 16;
  const uf = new UnionFindRank(n);
  for (let i = 1; i < n; i++) uf.union(0, i);
  // 最大 rank 应 ≤ 4（log2 16）
  let maxRank = 0;
  for (let i = 0; i < n; i++) maxRank = Math.max(maxRank, uf.rankOf(i));
  assert.ok(maxRank <= 4, `maxRank=${maxRank} should be ≤ log2(16)=4`);
});

test('unionFindRank 钩子被调用', () => {
  const unions: Array<[number, number, boolean]> = [];
  let finds = 0;
  unionFindRank(OPS, {
    onUnion: (a, b, _ra, _rb, _nr, _rank, merged) => unions.push([a, b, merged]),
    onFind: () => finds++,
  });
  assert.equal(unions.length, 7);
  assert.equal(unions[0]![0], 0);
  assert.equal(unions[0]![1], 1);
  assert.equal(unions[0]![2], true);
  assert.ok(finds > 0, 'find 应被调用');
});

test('unionFindRank 钩子：同根合并 merged=false', () => {
  const uf = new UnionFindRank(2);
  uf.union(0, 1);
  let flag = true;
  uf.union(0, 1, {
    onUnion: (_a, _b, _ra, _rb, _nr, _rank, merged) => {
      flag = merged;
    },
  });
  assert.equal(flag, false);
});

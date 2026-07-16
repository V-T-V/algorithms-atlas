import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UnionFind } from '../../src/algorithms/network/net-union-find/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-union-find/trace.ts';
test('UnionFind 正确', () => {
  const uf = new UnionFind(['A', 'B', 'C', 'D']);
  uf.union('A', 'B');
  uf.union('C', 'D');
  assert.equal(uf.find('A'), uf.find('B'));
  assert.notEqual(uf.find('A'), uf.find('C'));
  uf.union('B', 'C');
  assert.equal(uf.find('A'), uf.find('D'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blossom, type BlossomEdge } from '../../src/algorithms/network/blossom-algorithm/impl.ts';

test('blossom 单条边匹配 1 对', () => {
  const r = blossom(2, [{ from: 0, to: 1 }]);
  assert.equal(r.length, 1);
});

test('blossom 简单二分图（路径 P4）匹配 2 对', () => {
  // 0-1-2-3（路径）
  const edges: BlossomEdge[] = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ];
  const r = blossom(4, edges);
  assert.equal(r.length, 2);
});

test('blossom 三角形（奇环）至少匹配 1 对', () => {
  // 0-1-2-0（三角形）
  const edges: BlossomEdge[] = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
  ];
  const r = blossom(3, edges);
  assert.equal(r.length, 1);
});

test('blossom 空图返回 0 对', () => {
  const r = blossom(3, []);
  assert.equal(r.length, 0);
});

test('blossom 钩子被调用', () => {
  let searches = 0;
  let done = false;
  blossom(
    4,
    [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
    ],
    {
      onSearch: () => searches++,
      onDone: () => (done = true),
    },
  );
  assert.ok(searches > 0);
  assert.ok(done);
});

test('blossom 结果是合法匹配（每点最多 1 对）', () => {
  const edges: BlossomEdge[] = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 0 },
  ];
  const r = blossom(5, edges);
  const seen = new Set<number>();
  for (const [a, b] of r) {
    assert.ok(!seen.has(a), `${a} 不应重复匹配`);
    assert.ok(!seen.has(b), `${b} 不应重复匹配`);
    seen.add(a);
    seen.add(b);
  }
});

test('blossom 完全图 K4 最大匹配 = 2', () => {
  const edges: BlossomEdge[] = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
  ];
  const r = blossom(4, edges);
  assert.equal(r.length, 2);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LiChaoTree } from '../../src/algorithms/ds/ds-li-chao-2/impl.ts';

test('单条直线', () => {
  const t = new LiChaoTree(1, 10);
  t.insert({ k: 2, b: 1 }); // y = 2x+1
  assert.equal(t.query(5), 11);
  assert.equal(t.query(1), 3);
});

test('两条直线取最大', () => {
  const t = new LiChaoTree(1, 10);
  t.insert({ k: 1, b: 0 }); // y = x
  t.insert({ k: -1, b: 10 }); // y = -x+10
  // x=3: max(3, 7) = 7
  assert.equal(t.query(3), 7);
  // x=8: max(8, 2) = 8
  assert.equal(t.query(8), 8);
});

test('三条直线', () => {
  const t = new LiChaoTree(1, 20);
  t.insert({ k: 1, b: 0 });
  t.insert({ k: 2, b: -10 });
  t.insert({ k: 0, b: 5 }); // y = 5（水平线）
  // x=1: max(1, -8, 5) = 5
  assert.equal(t.query(1), 5);
  // x=10: max(10, 10, 5) = 10
  assert.equal(t.query(10), 10);
});

test('暴力对比', () => {
  const t = new LiChaoTree(1, 50);
  const lines = [
    { k: 1, b: 2 },
    { k: -2, b: 30 },
    { k: 0.5, b: 1 },
    { k: 3, b: -20 },
  ];
  lines.forEach((l) => t.insert(l));
  for (const x of [1, 5, 10, 20, 35, 50]) {
    const brute = Math.max(...lines.map((l) => l.k * x + l.b));
    assert.equal(t.query(x), brute);
  }
});

test('负斜率', () => {
  const t = new LiChaoTree(0, 10);
  t.insert({ k: -1, b: 10 });
  assert.equal(t.query(0), 10);
  assert.equal(t.query(10), 0);
});

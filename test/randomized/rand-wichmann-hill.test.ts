import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  WichmannHill,
  wichmannHill,
} from '../../src/algorithms/randomized/rand-wichmann-hill/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-wichmann-hill/trace.ts';

test('rand-wichmann-hill 输出在 [0,1)', () => {
  const r = new WichmannHill(42);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1);
  }
});

test('rand-wichmann-hill 确定性可复现', () => {
  const a = wichmannHill(10, 99);
  const b = wichmannHill(10, 99);
  assert.deepEqual(a, b);
});

test('rand-wichmann-hill 不同 seed 不同序列', () => {
  const a = wichmannHill(5, 1);
  const b = wichmannHill(5, 2);
  assert.notDeepEqual(a, b);
});

test('rand-wichmann-hill 均值接近 0.5', () => {
  const s = wichmannHill(2000, 7);
  const mean = s.reduce((x, y) => x + y, 0) / s.length;
  assert.ok(Math.abs(mean - 0.5) < 0.05, `mean=${mean}`);
});

test('rand-wichmann-hill trace', () => {
  assert.ok(buildTrace().length > 2);
});

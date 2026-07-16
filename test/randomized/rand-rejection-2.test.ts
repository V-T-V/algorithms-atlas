import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sampleUnitDisk,
  estimatePi,
  rejectionSample,
} from '../../src/algorithms/randomized/rand-rejection-2/impl.ts';

test('sampleUnitDisk 返回圆内点', () => {
  const { x, y, tries } = sampleUnitDisk();
  assert.ok(x * x + y * y <= 1);
  assert.ok(tries >= 1);
});

test('sampleUnitDisk 确定性', () => {
  const a = sampleUnitDisk();
  const b = sampleUnitDisk();
  assert.equal(a.x, b.x);
  assert.equal(a.y, b.y);
});

test('estimatePi 接近 π', () => {
  const pi = estimatePi(100000);
  assert.ok(Math.abs(pi - Math.PI) < 0.1, `π=${pi} 偏差过大`);
});

test('rejectionSample 接受合理', () => {
  // 提议 [0,1] 均匀，密度 f(x)=2x，M=2
  let seed = 3;
  const rng = () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return seed / 0x100000000;
  };
  const propose = () => rng();
  const x = rejectionSample(propose, (v) => 2 * v, 2, rng);
  assert.ok(x !== null && x >= 0 && x <= 1);
});

test('rejectionSample 超时返回 null', () => {
  // 密度恒为 0 → 永不接受
  const x = rejectionSample(
    () => 0.5,
    () => 0,
    1,
    undefined,
    10,
  );
  assert.equal(x, null);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reservoirSample } from '../../src/algorithms/randomized/rand-reservoir-2/impl.ts';

test('reservoirSample 长度正确', () => {
  const r = reservoirSample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
  assert.equal(r.length, 3);
});

test('reservoirSample 流短于 k 时全选', () => {
  const r = reservoirSample([1, 2], 5);
  assert.equal(r.length, 2);
  assert.deepEqual(
    r.sort((a, b) => a - b),
    [1, 2],
  );
});

test('reservoirSample k=0 返回空', () => {
  assert.deepEqual(reservoirSample([1, 2, 3], 0), []);
});

test('reservoirSample 确定性（同种子）', () => {
  const a = reservoirSample(
    Array.from({ length: 100 }, (_, i) => i),
    5,
  );
  const b = reservoirSample(
    Array.from({ length: 100 }, (_, i) => i),
    5,
  );
  assert.deepEqual(a, b);
});

test('reservoirSample 统计均匀性', () => {
  // 对固定流大量不同种子统计每个元素被选频率
  const stream = Array.from({ length: 20 }, (_, i) => i);
  const counts = new Array(20).fill(0);
  const rngSeed = 1;
  const trials = 5000;
  for (let t = 0; t < trials; t++) {
    let s = (rngSeed + t * 7919) >>> 0;
    const rng = () => {
      s = (s * 1103515245 + 12345) >>> 0;
      return s / 0x100000000;
    };
    const r = reservoirSample(stream, 5, rng);
    for (const v of r) counts[v]++;
  }
  // 期望每个元素被选 5/20 = 25% → trials * 0.25 = 1250
  for (const c of counts) {
    assert.ok(c > 1000 && c < 1500, `count ${c} 偏离均匀`);
  }
});

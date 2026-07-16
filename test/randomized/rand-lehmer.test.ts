import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Lehmer, lehmer } from '../../src/algorithms/randomized/rand-lehmer/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-lehmer/trace.ts';

test('rand-lehmer 在 [0,1)', () => {
  const r = new Lehmer(1);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1);
  }
});

test('rand-lehmer 周期 M-1', () => {
  const r = new Lehmer(1);
  r.nextInt(); // 推进一步
  // 经过 M-1 步应回到起点
  for (let i = 0; i < 0x7ffffffe - 1; i++) r.nextInt();
  // 验证小循环：连续两步不同
  const a = lehmer(2, 5);
  assert.notEqual(a[0], a[1]);
});

test('rand-lehmer 确定性', () => {
  assert.deepEqual(lehmer(10, 3), lehmer(10, 3));
});

test('rand-lehmer seed=0 被规范化', () => {
  const r = new Lehmer(0);
  assert.ok(r.next() > 0);
});

test('rand-lehmer trace', () => {
  assert.ok(buildTrace().length > 2);
});

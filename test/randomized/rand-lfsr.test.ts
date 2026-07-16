import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Lfsr, lfsr } from '../../src/algorithms/randomized/rand-lfsr/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-lfsr/trace.ts';

test('rand-lfsr 在 [0,1)', () => {
  const r = new Lfsr(0x1234);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1);
  }
});

test('rand-lfsr 周期 2^16-1（小验证）', () => {
  const r = new Lfsr(0x0001);
  // 推进若干步，不应回到 0
  for (let i = 0; i < 1000; i++) r.nextUint16();
  assert.notEqual((r as unknown as { state: number }).state, 0);
});

test('rand-lfsr 确定性', () => {
  assert.deepEqual(lfsr(10, 5), lfsr(10, 5));
});

test('rand-lfsr 种子 0 被替换', () => {
  const r = new Lfsr(0);
  assert.notEqual((r as unknown as { state: number }).state, 0);
});

test('rand-lfsr trace', () => {
  assert.ok(buildTrace().length > 2);
});

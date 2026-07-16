import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fastPowTail } from '../../src/algorithms/recursion/rec-pow-tail-2/impl.ts';

test('fastPowTail 基本', () => {
  assert.equal(fastPowTail(2, 10), 1024);
  assert.equal(fastPowTail(3, 0), 1);
  assert.equal(fastPowTail(5, 1), 5);
  assert.equal(fastPowTail(2, 16), 65536);
});

test('fastPowTail 与 Math.pow 一致', () => {
  for (let e = 0; e <= 30; e++) {
    assert.equal(fastPowTail(2, e), Math.pow(2, e));
  }
});

test('fastPowTail 底数为 1', () => {
  assert.equal(fastPowTail(1, 1000), 1);
});

test('fastPowTail 负指数抛错', () => {
  assert.throws(() => fastPowTail(2, -1));
});

test('fastPowTail 钩子', () => {
  let steps = 0;
  fastPowTail(2, 10, { onStep: () => steps++ });
  assert.ok(steps >= 4); // log2(10)≈3.3，应约 4-7 步
});

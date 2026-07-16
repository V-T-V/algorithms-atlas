import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RoundRobinSelect,
  roundRobinSample,
} from '../../src/algorithms/selection/sel-round-robin-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-round-robin-select/trace.ts';

test('sel-round-robin-select 顺序循环', () => {
  const rr = new RoundRobinSelect(['A', 'B', 'C']);
  assert.equal(rr.next(), 'A');
  assert.equal(rr.next(), 'B');
  assert.equal(rr.next(), 'C');
  assert.equal(rr.next(), 'A'); // 回绕
});

test('sel-round-robin-select 计数均匀', () => {
  const rr = new RoundRobinSelect(['A', 'B', 'C', 'D']);
  rr.sample(12);
  assert.deepEqual(rr.counts, [3, 3, 3, 3]);
});

test('sel-round-robin-select reset', () => {
  const rr = new RoundRobinSelect([1, 2, 3]);
  rr.sample(7);
  rr.reset();
  assert.deepEqual(rr.counts, [0, 0, 0]);
});

test('sel-round-robin-select 空抛错', () => {
  assert.throws(() => new RoundRobinSelect([]));
});

test('sel-round-robin-select roundRobinSample', () => {
  assert.deepEqual(roundRobinSample(['X', 'Y'], 4), ['X', 'Y', 'X', 'Y']);
});

test('sel-round-robin-select trace', () => {
  assert.ok(buildTrace().length > 2);
});

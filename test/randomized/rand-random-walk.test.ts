import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  randomWalk,
  makeRng,
  everReturnedToOrigin,
} from '../../src/algorithms/randomized/rand-random-walk/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-random-walk/trace.ts';

test('rand-random-walk 起点为 0', () => {
  const pos = randomWalk(10, makeRng(1));
  assert.equal(pos[0], 0);
});

test('rand-random-walk 步长 ±1', () => {
  const pos = randomWalk(50, makeRng(2));
  for (let i = 1; i < pos.length; i++) {
    assert.equal(Math.abs(pos[i]! - pos[i - 1]!), 1);
  }
});

test('rand-random-walk 返回长度 = steps+1', () => {
  assert.equal(randomWalk(20, makeRng(1)).length, 21);
});

test('rand-random-walk 确定性', () => {
  assert.deepEqual(randomWalk(10, makeRng(5)), randomWalk(10, makeRng(5)));
});

test('rand-random-walk everReturnedToOrigin', () => {
  assert.equal(everReturnedToOrigin([0, 1, 0]), true);
  assert.equal(everReturnedToOrigin([0, 1, 2, 3]), false);
});

test('rand-random-walk trace', () => {
  assert.ok(buildTrace().length > 2);
});

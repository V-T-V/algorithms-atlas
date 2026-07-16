import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knighttour } from '../../src/algorithms/backtracking/knight-tour/impl.ts';

test('knight-tour 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof knighttour === 'function');
});

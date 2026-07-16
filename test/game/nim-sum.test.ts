import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nimsum } from '../../src/algorithms/game/nim-sum/impl.ts';

test('nim-sum 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof nimsum === 'function');
});

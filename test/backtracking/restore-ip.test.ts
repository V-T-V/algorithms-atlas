import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreip } from '../../src/algorithms/backtracking/restore-ip/impl.ts';

test('restore-ip 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof restoreip === 'function');
});

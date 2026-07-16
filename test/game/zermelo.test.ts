import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zermelo } from '../../src/algorithms/game/zermelo/impl.ts';

test('zermelo 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof zermelo === 'function');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wavelet } from '../../src/algorithms/tree/wavelet/impl.ts';

test('wavelet 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof wavelet === 'function');
});

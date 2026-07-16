import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convert } from '../../src/algorithms/backtracking/bt-zigzag-pattern/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-zigzag-pattern/trace.ts';
test('convert 正确', () => {
  assert.equal(convert('PAYPALISHIRING', 3), 'PAHNAPLSIIGYIR');
  assert.equal(convert('PAYPALISHIRING', 4), 'PINALSIGYAHRPI');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});

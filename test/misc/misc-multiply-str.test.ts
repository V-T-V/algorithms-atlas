import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscMultiplyStr } from '../../src/algorithms/misc/misc-multiply-str/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-multiply-str/trace.ts';
test('multiply "123"×"456"="56088"', () => {
  assert.equal(miscMultiplyStr('123', '456'), '56088');
});
test('multiply 含 0', () => {
  assert.equal(miscMultiplyStr('0', '123'), '0');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));

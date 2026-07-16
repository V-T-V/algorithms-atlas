import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscExcelColNum } from '../../src/algorithms/misc/misc-excel-col-num/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-excel-col-num/trace.ts';
test('excel num "A"=1', () => {
  assert.equal(miscExcelColNum('A'), 1);
});
test('excel num "AB"=28', () => {
  assert.equal(miscExcelColNum('AB'), 28);
});
test('excel num "ZY"=701', () => {
  assert.equal(miscExcelColNum('ZY'), 701);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));

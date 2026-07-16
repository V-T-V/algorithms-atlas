import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscExcelColTitle2 } from '../../src/algorithms/misc/misc-excel-col-title-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-excel-col-title-2/trace.ts';
test('excel title 1→A', () => {
  assert.equal(miscExcelColTitle2(1), 'A');
});
test('excel title 28→AB', () => {
  assert.equal(miscExcelColTitle2(28), 'AB');
});
test('excel title 701→ZY', () => {
  assert.equal(miscExcelColTitle2(701), 'ZY');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));

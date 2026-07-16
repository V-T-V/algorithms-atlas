import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transformRows } from '../../src/algorithms/design/design-transform-view/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-transform-view/trace.ts';
const TFN = (r: { name: string }) => '<b>' + r.name + '</b>';
test('transform view 转换', () =>
  assert.equal(transformRows([{ name: 'a' }, { name: 'b' }], TFN), '<b>a</b><b>b</b>'));
test('transform-view trace 非空', () => assert.ok(buildTrace().length > 0));

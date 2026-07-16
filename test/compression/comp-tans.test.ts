import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tansBuildTable, tansEncode } from '../../src/algorithms/compression/comp-tans/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-tans/trace.ts';

test('tans table 长度 = L', () => {
  assert.equal(tansBuildTable([65, 66], 8).length, 8);
});
test('tans encode 返回状态', () => {
  const t = tansBuildTable([65, 66], 8);
  const s = tansEncode([65, 66, 65], t, 8);
  assert.ok(s >= 0 && s < 8);
});
test('tans trace 非空', () => assert.ok(buildTrace().length > 0));

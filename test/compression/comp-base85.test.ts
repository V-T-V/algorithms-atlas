import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ascii85Encode } from '../../src/algorithms/compression/comp-base85/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-base85/trace.ts';
test('ascii85 输出仅可见字符', () => {
  const o = ascii85Encode([1, 2, 3, 4]);
  assert.ok([...o].every((c) => c.charCodeAt(0) >= 33));
});
test('ascii85 trace 非空', () => assert.ok(buildTrace().length >= 2));

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Subject, queryExt } from '../../src/algorithms/design/design-extension-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-extension-object/trace.ts';
test('ext 命中', () => {
  const s = new Subject();
  s.setExtension('x', { id: 'x' });
  assert.equal(queryExt(s, 'x')?.id, 'x');
  assert.equal(queryExt(s, 'y'), undefined);
});
test('ext trace 非空', () => assert.ok(buildTrace().length > 0));

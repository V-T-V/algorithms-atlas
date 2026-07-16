import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPage } from '../../src/algorithms/design/design-page-template/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-page-template/trace.ts';
test('layout 含 title 与 slot', () => {
  const h = renderPage('T', { a: 'x' });
  assert.ok(h.includes('<title>T</title>'));
  assert.ok(h.includes('id="a">x</div>'));
});
test('layout trace 非空', () => assert.ok(buildTrace().length > 0));

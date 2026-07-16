import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LeafView, CompositeView } from '../../src/algorithms/design/design-composite-view/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-composite-view/trace.ts';
test('composite view 拼接', () => {
  const p = new CompositeView().add(new LeafView('a')).add(new LeafView('b'));
  assert.equal(p.render(), 'a\nb');
});
test('composite-view trace 非空', () => assert.ok(buildTrace().length > 0));

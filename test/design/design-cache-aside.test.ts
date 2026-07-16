import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CacheAside } from '../../src/algorithms/design/design-cache-aside/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-cache-aside/trace.ts';

test('cache-aside 首次 miss 后 hit', () => {
  let loads = 0;
  const ca = new CacheAside<string, number>((k) => {
    loads++;
    return k.length;
  });
  assert.equal(ca.get('abc'), 3);
  assert.equal(ca.get('abc'), 3);
  assert.equal(loads, 1);
});
test('cache-aside invalidate 后重新加载', () => {
  let loads = 0;
  const ca = new CacheAside<string, number>((k) => {
    loads++;
    return k.length;
  });
  ca.get('hi');
  ca.invalidate('hi');
  ca.get('hi');
  assert.equal(loads, 2);
});
test('cache-aside trace 非空', () => assert.ok(buildTrace().length > 0));

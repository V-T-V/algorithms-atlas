import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TreeFactory, Forest } from '../../src/algorithms/design/design-flyweight/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-flyweight/trace.ts';

test('flyweight 相同 key 复用', () => {
  const f = new TreeFactory();
  const a = f.get('oak', 'green', 'rough');
  const b = f.get('oak', 'green', 'rough');
  assert.equal(a, b);
  assert.equal(f.poolSize(), 1);
});
test('flyweight 不同 key 不复用', () => {
  const f = new TreeFactory();
  f.get('oak', 'green', 'rough');
  f.get('pine', 'dark', 'smooth');
  assert.equal(f.poolSize(), 2);
});
test('flyweight forest 种多棵同类只占一个池槽', () => {
  const f = new TreeFactory();
  const forest = new Forest(f);
  forest.plant('oak', 'green', 'rough', 1, 1);
  forest.plant('oak', 'green', 'rough', 2, 2);
  forest.plant('oak', 'green', 'rough', 3, 3);
  assert.equal(forest.treeCount(), 3);
  assert.equal(f.poolSize(), 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});

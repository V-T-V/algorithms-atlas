import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Instance,
  attack,
  type TypeObj,
} from '../../src/algorithms/design/design-type-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-type-object/trace.ts';
const t: TypeObj = { name: 'a', maxHp: 10, attack: 4 };
test('type-object 共享类型', () => {
  const i1 = new Instance(t);
  const i2 = new Instance(t);
  assert.equal(i1.hp, 10);
  attack(i1, i2);
  assert.equal(i2.hp, 6);
});
test('type-object trace 非空', () => assert.ok(buildTrace().length > 0));

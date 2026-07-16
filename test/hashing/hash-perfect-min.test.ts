import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perfectHashBuild } from '../../src/algorithms/hashing/hash-perfect-min/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-perfect-min/trace.ts';
test('完美哈希无冲突', () => {
  const r = perfectHashBuild(['a', 'b', 'c']);
  const slots = [...r.slot.values()];
  assert.equal(new Set(slots).size, slots.length);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});

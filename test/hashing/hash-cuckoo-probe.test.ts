import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cuckooInsert } from '../../src/algorithms/hashing/hash-cuckoo-probe/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-cuckoo-probe/trace.ts';
test('小规模布谷鸟成功', () => {
  const ok = cuckooInsert(
    ['a', 'b'],
    (k) => k.charCodeAt(0),
    (k) => k.charCodeAt(0) + 5,
  );
  assert.equal(ok, true);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});

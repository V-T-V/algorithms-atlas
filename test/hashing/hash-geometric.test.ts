import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geometricHash } from '../../src/algorithms/hashing/hash-geometric/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-geometric/trace.ts';

test('geometric 确定性', () => {
  const a = geometricHash(DEFAULT_INPUT);
  const b = geometricHash(DEFAULT_INPUT);
  assert.equal(a.size, b.size);
});
test('geometric 至少有 1 个单元', () => {
  const t = geometricHash([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ]);
  assert.ok(t.size >= 1);
});
test('geometric 不同点集不同', () => {
  const a = geometricHash([
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 2 },
  ]);
  const b = geometricHash([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ]);
  // 比较所有单元的 key 集合，不同点集应有不同的量化坐标
  const keysA = [...a.keys()].sort().join('|');
  const keysB = [...b.keys()].sort().join('|');
  assert.notEqual(keysA, keysB);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});

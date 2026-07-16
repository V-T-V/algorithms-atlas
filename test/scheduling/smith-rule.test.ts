import { test } from 'node:test';
import assert from 'node:assert/strict';
import { smithRule } from '../../src/algorithms/scheduling/smith-rule/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/smith-rule/trace.ts';

test('smithRule 按 w/p 降序', () => {
  const r = smithRule([
    { id: 'A', processing: 4, weight: 2 }, // 0.5
    { id: 'B', processing: 2, weight: 4 }, // 2
    { id: 'C', processing: 3, weight: 3 }, // 1
  ]);
  assert.deepEqual(r.order, ['B', 'C', 'A']);
});

test('smithRule 计算 ΣwjCj', () => {
  const r = smithRule([
    { id: 'A', processing: 2, weight: 4 }, // ratio 2, 完工 2, wC=8
    { id: 'B', processing: 4, weight: 2 }, // ratio 0.5, 完工 6, wC=12
  ]);
  assert.equal(r.totalWeightedCompletion, 20);
});

test('smithRule 等权退化为 SPT', () => {
  const r = smithRule([
    { id: 'A', processing: 5, weight: 1 },
    { id: 'B', processing: 2, weight: 1 },
    { id: 'C', processing: 3, weight: 1 },
  ]);
  assert.deepEqual(r.order, ['B', 'C', 'A']); // 按 p 升序
});

test('smithRule 平局按 id 字典序', () => {
  const r = smithRule([
    { id: 'Z', processing: 2, weight: 2 },
    { id: 'A', processing: 2, weight: 2 },
  ]);
  assert.deepEqual(r.order, ['A', 'Z']);
});

test('smithRule 单作业', () => {
  const r = smithRule([{ id: 'X', processing: 3, weight: 2 }]);
  assert.equal(r.totalWeightedCompletion, 6);
});

test('smithRule 非法输入抛错', () => {
  assert.throws(() => smithRule([{ id: 'A', processing: 0, weight: 1 }]));
  assert.throws(() => smithRule([{ id: 'A', processing: 1, weight: 0 }]));
});

test('smithRule 空输入', () => {
  const r = smithRule([]);
  assert.equal(r.totalWeightedCompletion, 0);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPipeline } from '../../src/algorithms/design/design-pipeline-2/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-pipeline-2/trace.ts';

test('pipeline 顺序执行', () => {
  const p = createPipeline<number>([
    { name: 'x2', fn: (x) => x * 2 },
    { name: '+1', fn: (x) => x + 1 },
  ]);
  assert.equal(p(5), 11);
});
test('pipeline 空管道原值返回', () => {
  const p = createPipeline<number>([]);
  assert.equal(p(42), 42);
});
test('pipeline trace 非空', () => assert.ok(buildTrace().length > 0));

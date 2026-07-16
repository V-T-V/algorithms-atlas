import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPipeline } from '../../src/algorithms/design/design-pipeline-filter/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-pipeline-filter/trace.ts';
const fs: Array<(x: number[]) => number[]> = [
  (x) => x.map((v) => v + 1),
  (x) => x.filter((v) => v > 3),
];
test('pipeline 串联', () => assert.deepEqual(runPipeline([1, 2, 3, 4, 5], fs), [4, 5]));
test('pipeline-filter trace 非空', () => assert.ok(buildTrace().length > 0));

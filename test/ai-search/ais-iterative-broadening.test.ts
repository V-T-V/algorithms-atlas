import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  iterativeBroadening,
  type IbTree,
} from '../../src/algorithms/ai-search/ais-iterative-broadening/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-iterative-broadening/trace.ts';
const T: IbTree = {
  root: 0,
  goal: 2,
  maxBranch: 3,
  maxDepth: 2,
  children: (n) => [n * 3 + 1, n * 3 + 2, n * 3 + 3],
};
test('ib 找到目标', () => assert.deepEqual(iterativeBroadening(T), [0, 2]));
test('ib trace 非空', () => assert.ok(buildTrace().length >= 2));

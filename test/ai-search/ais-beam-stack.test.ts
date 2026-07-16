import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  beamStackSearch,
  type BsProblem,
} from '../../src/algorithms/ai-search/ais-beam-stack/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-beam-stack/trace.ts';
const P: BsProblem = {
  start: 0,
  goal: 2,
  expand: (n) => [n + 1],
  eval: (n) => Math.abs(n - 2),
  beamWidth: 1,
  maxDepth: 5,
};
test('beam-stack 找到目标', () => assert.notEqual(beamStackSearch(P), null));
test('beam-stack trace 非空', () => assert.ok(buildTrace().length >= 2));

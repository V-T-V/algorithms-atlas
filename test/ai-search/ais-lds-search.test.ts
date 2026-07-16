import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ldsSearch, type LdsTree } from '../../src/algorithms/ai-search/ais-lds-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-lds-search/trace.ts';
const T: LdsTree = { root: 0, goal: 1, order: (n) => (n === 0 ? [1, 2] : []), maxDepth: 2 };
test('lds 找到目标', () => assert.deepEqual(ldsSearch(T, 0), [0, 1]));
test('lds trace 非空', () => assert.ok(buildTrace().length >= 2));

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quantileNearest } from '../../src/algorithms/selection/sel-quantile-nearest/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quantile-nearest/trace.ts';

test('quantile nearest Q0 = min', () => assert.equal(quantileNearest([5, 1, 3], 0), 1));
test('quantile nearest Q1 = max', () => assert.equal(quantileNearest([5, 1, 3], 1), 5));
test('quantile nearest trace 非空', () => assert.ok(buildTrace().length > 0));

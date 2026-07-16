import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quantileLinear } from '../../src/algorithms/selection/sel-quantile-linear/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quantile-linear/trace.ts';

test('quantile linear 中位数', () => assert.equal(quantileLinear([1, 2, 3, 4, 5], 0.5), 3));
test('quantile linear Q0 = min', () => assert.equal(quantileLinear([5, 1, 3], 0), 1));
test('quantile linear Q1 = max', () => assert.equal(quantileLinear([5, 1, 3], 1), 5));
test('quantile linear trace 非空', () => assert.ok(buildTrace().length > 0));

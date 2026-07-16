import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pearsonHash } from '../../src/algorithms/crypto/crypto-peter-pearson/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-peter-pearson/trace.ts';
test('pearson 确定性', () => assert.equal(pearsonHash([1, 2, 3]), pearsonHash([1, 2, 3])));
test('pearson 0-255', () =>
  assert.ok(pearsonHash([9, 9, 9]) >= 0 && pearsonHash([9, 9, 9]) <= 255));
test('pearson trace 非空', () => assert.ok(buildTrace().length > 0));

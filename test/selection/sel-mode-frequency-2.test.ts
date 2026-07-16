import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modeFrequency } from '../../src/algorithms/selection/sel-mode-frequency-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-mode-frequency-2/trace.ts';

test('sel-mode-frequency-2 多数元素', () => {
  const r = modeFrequency([2, 2, 1, 1, 2, 3, 2]);
  assert.equal(r.majority, 2);
  assert.equal(r.mode, 2);
});

test('sel-mode-frequency-2 无多数', () => {
  const r = modeFrequency([1, 2, 3]);
  assert.equal(r.majority, null);
});

test('sel-mode-frequency-2 众数频率', () => {
  const r = modeFrequency([1, 1, 2, 2, 2, 3]);
  assert.equal(r.mode, 2);
  assert.equal(r.modeFreq, 3);
});

test('sel-mode-frequency-2 空数组', () => {
  const r = modeFrequency([]);
  assert.equal(r.mode, null);
});

test('sel-mode-frequency-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bulbSwitch,
  bulbSwitchSimulate,
} from '../../src/algorithms/misc/misc-bulb-switcher/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-bulb-switcher/trace.ts';

test('bulb-switch n=3 = 1', () => {
  assert.equal(bulbSwitch(3), 1);
});

test('bulb-switch n=9 = 3', () => {
  assert.equal(bulbSwitch(9), 3);
});

test('bulb-switch n=0 = 0', () => {
  assert.equal(bulbSwitch(0), 0);
});

test('bulb-switch n=1 = 1', () => {
  assert.equal(bulbSwitch(1), 1);
});

test('bulb-switch 数学 == 模拟', () => {
  for (let n = 0; n <= 50; n++) {
    assert.equal(bulbSwitch(n), bulbSwitchSimulate(n), `n=${n}`);
  }
});

test('bulb-switch 非法抛错', () => {
  assert.throws(() => bulbSwitch(-1));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});

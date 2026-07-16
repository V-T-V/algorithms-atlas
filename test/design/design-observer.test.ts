import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  WeatherStation,
  DisplayObserver,
} from '../../src/algorithms/design/design-observer/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-observer/trace.ts';

test('observer 订阅后接收通知', () => {
  const s = new WeatherStation();
  const d = new DisplayObserver('d');
  s.attach(d);
  s.setTemperature(42);
  assert.equal(d.lastReading, 42);
});
test('observer 退订后不再接收', () => {
  const s = new WeatherStation();
  const d = new DisplayObserver('d');
  s.attach(d);
  s.setTemperature(1);
  s.detach(d);
  s.setTemperature(99);
  assert.equal(d.lastReading, 1);
});
test('observer 多个订阅者都接收', () => {
  const s = new WeatherStation();
  const d1 = new DisplayObserver('d1');
  const d2 = new DisplayObserver('d2');
  s.attach(d1);
  s.attach(d2);
  s.setTemperature(7);
  assert.equal(d1.lastReading, 7);
  assert.equal(d2.lastReading, 7);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});

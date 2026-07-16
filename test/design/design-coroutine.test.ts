import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CoroutineScheduler,
  taskCoroutine,
} from '../../src/algorithms/design/design-coroutine/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-coroutine/trace.ts';

test('coroutine 单任务完成', () => {
  const s = new CoroutineScheduler();
  s.add('A', 3);
  const r = s.run();
  assert.deepEqual(r.completed, ['A']);
  assert.equal(r.totalSteps, 3);
});
test('coroutine 多任务交替完成', () => {
  const s = new CoroutineScheduler();
  s.add('A', 2);
  s.add('B', 2);
  const r = s.run();
  assert.equal(r.completed.length, 2);
  assert.equal(r.totalSteps, 4);
});
test('coroutine 短任务先完成', () => {
  const s = new CoroutineScheduler();
  s.add('short', 1);
  s.add('long', 5);
  const r = s.run();
  assert.equal(r.completed[0], 'short');
});
test('coroutine generator 逐步 yield', () => {
  const gen = taskCoroutine('X', 3);
  assert.equal(gen.next().value, 1);
  assert.equal(gen.next().value, 2);
  assert.equal(gen.next().value, 3);
  assert.equal(gen.next().done, true);
});
test('coroutine 空调度器立即返回', () => {
  const s = new CoroutineScheduler();
  const r = s.run();
  assert.deepEqual(r.completed, []);
  assert.equal(r.totalSteps, 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});

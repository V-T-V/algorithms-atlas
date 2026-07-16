import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  simulateTanenbaum,
  TanenbaumTable,
} from '../../src/algorithms/concurrency/conc-philosophers-tanenbaum/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-philosophers-tanenbaum/trace.ts';

test('conc-philosophers-tanenbaum 相邻不同时进餐', () => {
  const steps = simulateTanenbaum(5, [
    { philosopher: 0, action: 'take' },
    { philosopher: 1, action: 'take' },
  ]);
  // P1 应被阻塞（邻接 P0）
  assert.equal(steps[1]!.blocked, true);
  assert.notEqual(steps[1]!.states[1], 'EATING');
});

test('conc-philosophers-tanenbaum 放叉唤醒邻居', () => {
  const steps = simulateTanenbaum(5, [
    { philosopher: 0, action: 'take' },
    { philosopher: 1, action: 'take' },
    { philosopher: 0, action: 'put' },
  ]);
  // 这里 put 后 test 邻居，P1 应被解除阻塞状态变 EATING
  assert.equal(steps[2]!.states[1], 'EATING');
});

test('conc-philosophers-tanenbaum 非邻接可同时进餐', () => {
  const t = new TanenbaumTable(5);
  t.takeForks(0);
  const ok = t.takeForks(2);
  assert.equal(ok, true);
});

test('conc-philosophers-tanenbaum trace', () => {
  assert.ok(buildTrace().length > 2);
});

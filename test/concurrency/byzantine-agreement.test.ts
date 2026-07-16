import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runByzantine } from '../../src/algorithms/concurrency/byzantine-agreement/impl.ts';

test('byzantine 无叛徒时所有诚实进程一致', () => {
  const r = runByzantine(4, [1, 1, 1, 1], [0, 1, 2, 3], [{}, {}], 0);
  assert.equal(r.honestAgreement, true);
});

test('byzantine 4 将军 1 叛徒（n>=3f+1）仍一致', () => {
  // P3 叛徒，对每人发不同值
  const r = runByzantine(
    4,
    [1, 1, 1],
    [0, 1, 2],
    [{ 3: { 0: 0, 1: 1, 2: 0 } }, { 3: { 0: 1, 1: 0, 2: 1 } }],
    1,
  );
  assert.equal(r.honestAgreement, true);
});

test('byzantine 诚实进程初始值相同则决策相同', () => {
  const r = runByzantine(
    4,
    [1, 1, 1],
    [0, 1, 2],
    [{ 3: { 0: 0, 1: 0, 2: 0 } }, { 3: { 0: 0, 1: 0, 2: 0 } }],
    1,
  );
  // P0,P1,P2 决策应都是 1（多数）
  assert.equal(r.decisions[0], 1);
  assert.equal(r.decisions[1], 1);
  assert.equal(r.decisions[2], 1);
});

test('byzantine 钩子 onDecide 每个进程触发一次', () => {
  const decided: number[] = [];
  runByzantine(3, [1, 1, 1], [0, 1, 2], [{}, {}], 0, { onDecide: (p) => decided.push(p) });
  assert.deepEqual(decided, [0, 1, 2]);
});

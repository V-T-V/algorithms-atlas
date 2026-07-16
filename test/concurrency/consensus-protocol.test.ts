import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPaxos } from '../../src/algorithms/concurrency/consensus-protocol/impl.ts';

test('paxos 多数派响应：值被选定', () => {
  const r = runPaxos(3, 42, 1);
  assert.equal(r.chosen, true);
  assert.equal(r.value, 42);
});

test('paxos 单 Acceptor（多数=1）也能选定', () => {
  const r = runPaxos(1, 7, 1);
  assert.equal(r.chosen, true);
  assert.equal(r.value, 7);
});

test('paxos 5 个 Acceptor 选定值', () => {
  const r = runPaxos(5, 100, 1);
  assert.equal(r.chosen, true);
  assert.equal(r.value, 100);
  // 多数（>=3）应已接受
  const accepted = r.finalAcceptors.filter((a) => a.acceptedV === 100).length;
  assert.ok(accepted >= 3);
});

test('paxos 选定后所有接受的 Acceptor 值一致', () => {
  const r = runPaxos(3, 9, 1);
  assert.equal(r.chosen, true);
  for (const a of r.finalAcceptors) {
    if (a.acceptedV !== null) assert.equal(a.acceptedV, 9);
  }
});

test('paxos onChosen 钩子在成功时触发一次', () => {
  let chosen: number | null = null;
  let count = 0;
  runPaxos(3, 55, 2, {
    onChosen: (v) => {
      chosen = v;
      count++;
    },
  });
  assert.equal(chosen, 55);
  assert.equal(count, 1);
});

test('paxos Acceptor 状态：承诺编号更新', () => {
  const r = runPaxos(3, 1, 5);
  for (const a of r.finalAcceptors) {
    assert.ok(a.promisedN >= 5);
  }
});

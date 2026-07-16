import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PetersonN,
  simulatePetersonN,
  Peterson2,
} from '../../src/algorithms/concurrency/conc-peterson-n/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-peterson-n/trace.ts';

test('conc-peterson-n 树结构正确', () => {
  const p = new PetersonN(4);
  assert.equal(p.levels.length, 2);
  assert.equal(p.levels[0]!.length, 2);
  assert.equal(p.levels[1]!.length, 1);
});

test('conc-peterson-n 临界区至多一人', () => {
  const steps = simulatePetersonN(4, [0, 3, 1, 2]);
  for (const s of steps) assert.ok(s.inCs.length <= 1);
});

test('conc-peterson-n Peterson2 基本操作', () => {
  const l = new Peterson2();
  l.lock(0);
  assert.equal(l.holder, 0);
  l.unlock(0);
  assert.equal(l.holder, -1);
});

test('conc-peterson-n trace', () => {
  assert.ok(buildTrace().length > 2);
});

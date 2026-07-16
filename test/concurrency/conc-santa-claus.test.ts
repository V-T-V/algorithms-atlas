import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SantaClaus,
  simulateSanta,
} from '../../src/algorithms/concurrency/conc-santa-claus/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-santa-claus/trace.ts';

test('conc-santa-claus 驯鹿优先', () => {
  const santa = new SantaClaus(9, 3);
  for (let i = 0; i < 3; i++) santa.elfProblem(i);
  for (let i = 0; i < 9; i++) santa.reindeerReturn();
  // 两者都满足，驯鹿优先
  assert.equal(santa.wake(), 'deliver-toys');
});

test('conc-santa-claus 精灵求助', () => {
  const santa = new SantaClaus(9, 3);
  for (let i = 0; i < 3; i++) santa.elfProblem(i);
  assert.equal(santa.wake(), 'help-elves');
});

test('conc-santa-claus 不够继续睡', () => {
  const santa = new SantaClaus(9, 3);
  santa.elfProblem(0);
  santa.reindeerReturn();
  assert.equal(santa.wake(), 'sleep');
});

test('conc-santa-claus simulate', () => {
  const steps = simulateSanta(
    [{ type: 'elf-problem' }, { type: 'elf-problem' }, { type: 'elf-problem' }],
    { elvesNeeded: 3 },
  );
  const wakeStep = steps.find((s) => s.event === 'santa-wake');
  assert.ok(wakeStep);
  assert.equal(wakeStep!.santaAction, 'help-elves');
});

test('conc-santa-claus trace', () => {
  assert.ok(buildTrace().length > 1);
});

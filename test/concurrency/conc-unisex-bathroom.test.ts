import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateUnisexBathroom } from '../../src/algorithms/concurrency/conc-unisex-bathroom/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-unisex-bathroom/trace.ts';

test('conc-unisex-bathroom 异性别被阻塞', () => {
  const steps = simulateUnisexBathroom(
    [
      { person: 1, gender: 'M', action: 'enter' },
      { person: 2, gender: 'F', action: 'enter' },
    ],
    3,
  );
  assert.deepEqual(steps[0]!.inside, [1]);
  assert.deepEqual(
    steps[1]!.waiting.map((w) => w.person),
    [2],
  );
});

test('conc-unisex-bathroom 室空后切换性别', () => {
  const steps = simulateUnisexBathroom(
    [
      { person: 1, gender: 'M', action: 'enter' },
      { person: 2, gender: 'F', action: 'enter' },
      { person: 1, gender: 'M', action: 'leave' },
      { person: 2, gender: 'F', action: 'enter' },
    ],
    3,
  );
  // leave 后 2 被自动准入
  assert.deepEqual(steps[2]!.inside, [2]);
  assert.equal(steps[2]!.currentGender, 'F');
});

test('conc-unisex-bathroom 容量限制', () => {
  const steps = simulateUnisexBathroom(
    [
      { person: 1, gender: 'M', action: 'enter' },
      { person: 2, gender: 'M', action: 'enter' },
      { person: 3, gender: 'M', action: 'enter' },
    ],
    2,
  );
  assert.equal(steps[2]!.inside.length, 2);
  assert.equal(steps[2]!.waiting.length, 1);
});

test('conc-unisex-bathroom trace', () => {
  assert.ok(buildTrace().length > 2);
});

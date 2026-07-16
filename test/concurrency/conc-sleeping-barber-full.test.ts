import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sleepingBarberFull } from '../../src/algorithms/concurrency/conc-sleeping-barber-full/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-sleeping-barber-full/trace.ts';
test('barber 满座流失', () => {
  const r = sleepingBarberFull(1, 5);
  assert.ok(r.lost > 0);
});
test('barber trace 非空', () => assert.ok(buildTrace().length >= 2));
